import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// =========================================================================
// LIST user subscriptions
// =========================================================================
export const listSubscriptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("sms_subscriptions")
      .select(
        "id, active, frequency, created_at, commodity:commodities(id,name,category,unit_of_measure)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { subscriptions: data ?? [] };
  });

// =========================================================================
// CREATE subscription
// =========================================================================
const createSchema = z.object({
  commodityId: z.string().uuid(),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
});

export const createSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("sms_subscriptions")
      .insert({
        user_id: userId,
        commodity_id: data.commodityId,
        frequency: data.frequency,
      })
      .select("id, active, frequency, commodity:commodities(id,name,category)")
      .single();
    if (error) throw new Error(error.message);
    return { subscription: row };
  });

// =========================================================================
// TOGGLE subscription active/inactive
// =========================================================================
const toggleSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean(),
});

export const toggleSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => toggleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("sms_subscriptions")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// =========================================================================
// DELETE subscription
// =========================================================================
const deleteSchema = z.object({ id: z.string().uuid() });

export const deleteSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deleteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("sms_subscriptions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
