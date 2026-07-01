import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as requireSupabaseAuth } from "./auth-middleware-nRAWUjb7.js";
import { t as supabase } from "./client-BmsDyj3x.js";
import { z } from "zod";
//#region src/lib/prices.functions.ts?tss-serverfn-split
/**
* Public Supabase client (publishable key, no session).
* Used for read-only price queries that anyone (even logged-out) can run.
* RLS policies still apply — markets/commodities/prices have "Public read" policies.
*/
function publicClient() {
	return supabase;
}
var listPricesSchema = z.object({
	marketId: z.string().uuid().optional(),
	commodityId: z.string().uuid().optional(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	limit: z.number().int().min(1).max(500).default(100)
});
var listPrices_createServerFn_handler = createServerRpc({
	id: "eee3e1f498ce72252a6c0b4ff5e16a2c290edc99ace864c5cc8377e8d4cf6f8c",
	name: "listPrices",
	filename: "src/lib/prices.functions.ts"
}, (opts) => listPrices.__executeServer(opts));
var listPrices = createServerFn({ method: "GET" }).inputValidator((input) => listPricesSchema.parse(input)).handler(listPrices_createServerFn_handler, async ({ data }) => {
	let q = publicClient().from("prices").select("id, price_ghs, date_recorded, created_at, commodity:commodities(id,name,unit_of_measure,category), market:markets(id,name,region)").order("date_recorded", { ascending: false }).order("created_at", { ascending: false }).limit(data.limit);
	if (data.marketId) q = q.eq("market_id", data.marketId);
	if (data.commodityId) q = q.eq("commodity_id", data.commodityId);
	if (data.startDate) q = q.gte("date_recorded", data.startDate);
	if (data.endDate) q = q.lte("date_recorded", data.endDate);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return { prices: rows ?? [] };
});
var latestSchema = z.object({
	commodityId: z.string().uuid().optional(),
	marketId: z.string().uuid().optional()
});
var getLatestPrices_createServerFn_handler = createServerRpc({
	id: "9c769814b8c94cae80fb03c608865601d5165c9c607ee6ca237fd03de6549f96",
	name: "getLatestPrices",
	filename: "src/lib/prices.functions.ts"
}, (opts) => getLatestPrices.__executeServer(opts));
var getLatestPrices = createServerFn({ method: "GET" }).inputValidator((input) => latestSchema.parse(input)).handler(getLatestPrices_createServerFn_handler, async ({ data }) => {
	let q = publicClient().from("prices").select("id, price_ghs, date_recorded, commodity_id, market_id, commodity:commodities(id,name,unit_of_measure,category), market:markets(id,name,region)").order("date_recorded", { ascending: false }).order("created_at", { ascending: false }).limit(500);
	if (data.commodityId) q = q.eq("commodity_id", data.commodityId);
	if (data.marketId) q = q.eq("market_id", data.marketId);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const seen = /* @__PURE__ */ new Set();
	const latest = [];
	for (const r of rows ?? []) {
		const key = `${r.market_id}:${r.commodity_id}`;
		if (seen.has(key)) continue;
		seen.add(key);
		latest.push(r);
	}
	return { prices: latest };
});
var trendsSchema = z.object({
	commodityId: z.string().uuid(),
	marketId: z.string().uuid().optional(),
	days: z.number().int().min(1).max(365).default(30)
});
var getPriceTrends_createServerFn_handler = createServerRpc({
	id: "4b307f313d2dc4df5c2d69e166789922ea08512a495d0183d10501de2042f373",
	name: "getPriceTrends",
	filename: "src/lib/prices.functions.ts"
}, (opts) => getPriceTrends.__executeServer(opts));
var getPriceTrends = createServerFn({ method: "GET" }).inputValidator((input) => trendsSchema.parse(input)).handler(getPriceTrends_createServerFn_handler, async ({ data }) => {
	const sb = publicClient();
	const since = /* @__PURE__ */ new Date();
	since.setDate(since.getDate() - data.days);
	const sinceStr = since.toISOString().slice(0, 10);
	let q = sb.from("prices").select("price_ghs, date_recorded, market_id, market:markets(id,name)").eq("commodity_id", data.commodityId).gte("date_recorded", sinceStr).order("date_recorded", { ascending: true });
	if (data.marketId) q = q.eq("market_id", data.marketId);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const byMarket = /* @__PURE__ */ new Map();
	for (const r of rows ?? []) {
		const m = r.market;
		if (!m) continue;
		const series = byMarket.get(m.id) ?? {
			marketId: m.id,
			marketName: m.name,
			points: []
		};
		series.points.push({
			date: r.date_recorded,
			price: Number(r.price_ghs)
		});
		byMarket.set(m.id, series);
	}
	return { series: Array.from(byMarket.values()) };
});
var compareSchema = z.object({ commodityId: z.string().uuid() });
var comparePricesAcrossMarkets_createServerFn_handler = createServerRpc({
	id: "93a12b46deca1ae195fb14d8e3a2b161e574bd35f0a342182f87d95592135e7f",
	name: "comparePricesAcrossMarkets",
	filename: "src/lib/prices.functions.ts"
}, (opts) => comparePricesAcrossMarkets.__executeServer(opts));
var comparePricesAcrossMarkets = createServerFn({ method: "GET" }).inputValidator((input) => compareSchema.parse(input)).handler(comparePricesAcrossMarkets_createServerFn_handler, async ({ data }) => {
	const sb = publicClient();
	const { data: markets, error: mErr } = await sb.from("markets").select("id, name, region").order("name");
	if (mErr) throw new Error(mErr.message);
	const { data: rows, error } = await sb.from("prices").select("price_ghs, date_recorded, market_id").eq("commodity_id", data.commodityId).order("date_recorded", { ascending: false }).order("created_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	const latestByMarket = /* @__PURE__ */ new Map();
	for (const r of rows ?? []) {
		if (latestByMarket.has(r.market_id)) continue;
		latestByMarket.set(r.market_id, {
			price: Number(r.price_ghs),
			date: r.date_recorded
		});
	}
	const comparison = (markets ?? []).map((m) => ({
		marketId: m.id,
		marketName: m.name,
		region: m.region,
		latestPrice: latestByMarket.get(m.id)?.price ?? null,
		lastUpdated: latestByMarket.get(m.id)?.date ?? null
	}));
	const prices = comparison.map((c) => c.latestPrice).filter((p) => p != null);
	return {
		comparison,
		summary: prices.length ? {
			min: Math.min(...prices),
			max: Math.max(...prices),
			avg: Number((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2))
		} : null
	};
});
async function ensureCanEditPrices(supabase, userId) {
	const [{ data: isOfficer }, { data: isAdmin }] = await Promise.all([supabase.rpc("has_role", {
		_user_id: userId,
		_role: "data_officer"
	}), supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	})]);
	if (!isOfficer && !isAdmin) throw new Error("Only data officers and admins can manage prices.");
}
var createPriceSchema = z.object({
	commodityId: z.string().uuid(),
	marketId: z.string().uuid(),
	priceGhs: z.number().positive().max(1e6),
	dateRecorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
var createPrice_createServerFn_handler = createServerRpc({
	id: "391b4fee013d02c747f0dcb6b56a3754cef2b6aef8a3c9945f8dc7ae5539f475",
	name: "createPrice",
	filename: "src/lib/prices.functions.ts"
}, (opts) => createPrice.__executeServer(opts));
var createPrice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => createPriceSchema.parse(input)).handler(createPrice_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await ensureCanEditPrices(supabase, userId);
	const { data: row, error } = await supabase.from("prices").insert({
		commodity_id: data.commodityId,
		market_id: data.marketId,
		price_ghs: data.priceGhs,
		date_recorded: data.dateRecorded ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		recorded_by: userId
	}).select("id, commodity_id, market_id, price_ghs, date_recorded").single();
	if (error) throw new Error(error.message);
	await supabase.from("audit_log").insert({
		user_id: userId,
		action: "create",
		table_name: "prices",
		record_id: row.id,
		details: data
	});
	return { price: row };
});
var updatePriceSchema = z.object({
	id: z.string().uuid(),
	priceGhs: z.number().positive().max(1e6).optional(),
	dateRecorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
var updatePrice_createServerFn_handler = createServerRpc({
	id: "a65c8f90a9a3ee4a6ac67b90a3a8109b073901a8d36dcc8a23872d99aab49821",
	name: "updatePrice",
	filename: "src/lib/prices.functions.ts"
}, (opts) => updatePrice.__executeServer(opts));
var updatePrice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => updatePriceSchema.parse(input)).handler(updatePrice_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await ensureCanEditPrices(supabase, userId);
	const patch = {};
	if (data.priceGhs !== void 0) patch.price_ghs = data.priceGhs;
	if (data.dateRecorded !== void 0) patch.date_recorded = data.dateRecorded;
	const { data: row, error } = await supabase.from("prices").update(patch).eq("id", data.id).select("id, commodity_id, market_id, price_ghs, date_recorded").single();
	if (error) throw new Error(error.message);
	await supabase.from("audit_log").insert({
		user_id: userId,
		action: "update",
		table_name: "prices",
		record_id: data.id,
		details: patch
	});
	return { price: row };
});
var deletePriceSchema = z.object({ id: z.string().uuid() });
var deletePrice_createServerFn_handler = createServerRpc({
	id: "c0b94b24a2ce3eb2aafdd399238dd328b77039135a067d255c7aa84af5277f3a",
	name: "deletePrice",
	filename: "src/lib/prices.functions.ts"
}, (opts) => deletePrice.__executeServer(opts));
var deletePrice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => deletePriceSchema.parse(input)).handler(deletePrice_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await ensureCanEditPrices(supabase, userId);
	const { error } = await supabase.from("prices").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	await supabase.from("audit_log").insert({
		user_id: userId,
		action: "delete",
		table_name: "prices",
		record_id: data.id
	});
	return { ok: true };
});
//#endregion
export { comparePricesAcrossMarkets_createServerFn_handler, createPrice_createServerFn_handler, deletePrice_createServerFn_handler, getLatestPrices_createServerFn_handler, getPriceTrends_createServerFn_handler, listPrices_createServerFn_handler, updatePrice_createServerFn_handler };
