import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public Supabase client (publishable key, no session).
 * Used for read-only price queries that anyone (even logged-out) can run.
 * RLS policies still apply — markets/commodities/prices have "Public read" policies.
 */
function publicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

// =========================================================================
// LIST PRICES (filterable)
// =========================================================================
const listPricesSchema = z.object({
  marketId: z.string().uuid().optional(),
  commodityId: z.string().uuid().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  limit: z.number().int().min(1).max(500).default(100),
});

export const listPrices = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listPricesSchema.parse(input))
  .handler(async ({ data }) => {
    const sb = publicClient();
    let q = sb
      .from("prices")
      .select(
        "id, price_ghs, date_recorded, created_at, commodity:commodities(id,name,unit_of_measure,category), market:markets(id,name,region)",
      )
      .order("date_recorded", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.marketId) q = q.eq("market_id", data.marketId);
    if (data.commodityId) q = q.eq("commodity_id", data.commodityId);
    if (data.startDate) q = q.gte("date_recorded", data.startDate);
    if (data.endDate) q = q.lte("date_recorded", data.endDate);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { prices: rows ?? [] };
  });

// =========================================================================
// LATEST PRICE per market+commodity (used by home/market/commodity pages)
// =========================================================================
const latestSchema = z.object({
  commodityId: z.string().uuid().optional(),
  marketId: z.string().uuid().optional(),
});

export const getLatestPrices = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => latestSchema.parse(input))
  .handler(async ({ data }) => {
    const sb = publicClient();
    // Pull recent prices, then dedupe to latest per (market_id, commodity_id) in JS.
    let q = sb
      .from("prices")
      .select(
        "id, price_ghs, date_recorded, commodity_id, market_id, commodity:commodities(id,name,unit_of_measure,category), market:markets(id,name,region)",
      )
      .order("date_recorded", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.commodityId) q = q.eq("commodity_id", data.commodityId);
    if (data.marketId) q = q.eq("market_id", data.marketId);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const seen = new Set<string>();
    const latest = [];
    for (const r of rows ?? []) {
      const key = `${r.market_id}:${r.commodity_id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      latest.push(r);
    }
    return { prices: latest };
  });

// =========================================================================
// TRENDS — price history for one commodity (optionally in one market)
// =========================================================================
const trendsSchema = z.object({
  commodityId: z.string().uuid(),
  marketId: z.string().uuid().optional(),
  days: z.number().int().min(1).max(365).default(30),
});

export const getPriceTrends = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => trendsSchema.parse(input))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const since = new Date();
    since.setDate(since.getDate() - data.days);
    const sinceStr = since.toISOString().slice(0, 10);

    let q = sb
      .from("prices")
      .select("price_ghs, date_recorded, market_id, market:markets(id,name)")
      .eq("commodity_id", data.commodityId)
      .gte("date_recorded", sinceStr)
      .order("date_recorded", { ascending: true });

    if (data.marketId) q = q.eq("market_id", data.marketId);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    // Group by market for chart series.
    const byMarket = new Map<
      string,
      { marketId: string; marketName: string; points: { date: string; price: number }[] }
    >();
    for (const r of rows ?? []) {
      const m = r.market as { id: string; name: string } | null;
      if (!m) continue;
      const series = byMarket.get(m.id) ?? { marketId: m.id, marketName: m.name, points: [] };
      series.points.push({ date: r.date_recorded, price: Number(r.price_ghs) });
      byMarket.set(m.id, series);
    }
    return { series: Array.from(byMarket.values()) };
  });

// =========================================================================
// COMPARE — latest price for one commodity across every market
// =========================================================================
const compareSchema = z.object({ commodityId: z.string().uuid() });

export const comparePricesAcrossMarkets = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => compareSchema.parse(input))
  .handler(async ({ data }) => {
    const sb = publicClient();

    const { data: markets, error: mErr } = await sb
      .from("markets")
      .select("id, name, region")
      .order("name");
    if (mErr) throw new Error(mErr.message);

    const { data: rows, error } = await sb
      .from("prices")
      .select("price_ghs, date_recorded, market_id")
      .eq("commodity_id", data.commodityId)
      .order("date_recorded", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const latestByMarket = new Map<string, { price: number; date: string }>();
    for (const r of rows ?? []) {
      if (latestByMarket.has(r.market_id)) continue;
      latestByMarket.set(r.market_id, { price: Number(r.price_ghs), date: r.date_recorded });
    }

    const comparison = (markets ?? []).map((m) => ({
      marketId: m.id,
      marketName: m.name,
      region: m.region,
      latestPrice: latestByMarket.get(m.id)?.price ?? null,
      lastUpdated: latestByMarket.get(m.id)?.date ?? null,
    }));

    const prices = comparison.map((c) => c.latestPrice).filter((p): p is number => p != null);
    return {
      comparison,
      summary: prices.length
        ? {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: Number((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)),
          }
        : null,
    };
  });

// =========================================================================
// MUTATIONS — data_officer / admin only
// RLS enforces the role; we also pre-check to give a friendly error.
// =========================================================================
async function ensureCanEditPrices(supabase: SupabaseClient<Database>, userId: string) {
  const [{ data: isOfficer }, { data: isAdmin }] = await Promise.all([
    supabase.rpc("has_role", { _user_id: userId, _role: "data_officer" }),
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
  ]);
  if (!isOfficer && !isAdmin) {
    throw new Error("Only data officers and admins can manage prices.");
  }
}

const createPriceSchema = z.object({
  commodityId: z.string().uuid(),
  marketId: z.string().uuid(),
  priceGhs: z.number().positive().max(1_000_000),
  dateRecorded: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const createPrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createPriceSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureCanEditPrices(supabase, userId);

    const { data: row, error } = await supabase
      .from("prices")
      .insert({
        commodity_id: data.commodityId,
        market_id: data.marketId,
        price_ghs: data.priceGhs,
        date_recorded: data.dateRecorded ?? new Date().toISOString().slice(0, 10),
        recorded_by: userId,
      })
      .select("id, commodity_id, market_id, price_ghs, date_recorded")
      .single();
    if (error) throw new Error(error.message);

    await supabase.from("audit_log").insert({
      user_id: userId,
      action: "create",
      table_name: "prices",
      record_id: row.id,
      details: data,
    });
    return { price: row };
  });

const updatePriceSchema = z.object({
  id: z.string().uuid(),
  priceGhs: z.number().positive().max(1_000_000).optional(),
  dateRecorded: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const updatePrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updatePriceSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureCanEditPrices(supabase, userId);

    const patch: { price_ghs?: number; date_recorded?: string } = {};
    if (data.priceGhs !== undefined) patch.price_ghs = data.priceGhs;
    if (data.dateRecorded !== undefined) patch.date_recorded = data.dateRecorded;

    const { data: row, error } = await supabase
      .from("prices")
      .update(patch)
      .eq("id", data.id)
      .select("id, commodity_id, market_id, price_ghs, date_recorded")
      .single();
    if (error) throw new Error(error.message);

    await supabase.from("audit_log").insert({
      user_id: userId,
      action: "update",
      table_name: "prices",
      record_id: data.id,
      details: patch as Record<string, string | number>,
    });
    return { price: row };
  });

const deletePriceSchema = z.object({ id: z.string().uuid() });

export const deletePrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deletePriceSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureCanEditPrices(supabase, userId);

    const { error } = await supabase.from("prices").delete().eq("id", data.id);
    if (error) throw new Error(error.message);

    await supabase.from("audit_log").insert({
      user_id: userId,
      action: "delete",
      table_name: "prices",
      record_id: data.id,
    });
    return { ok: true };
  });
