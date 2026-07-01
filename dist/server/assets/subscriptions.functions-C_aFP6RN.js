import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as requireSupabaseAuth } from "./auth-middleware-nRAWUjb7.js";
import { z } from "zod";
//#region src/lib/subscriptions.functions.ts?tss-serverfn-split
var listSubscriptions_createServerFn_handler = createServerRpc({
	id: "e24333c6272feb27d0ee4789f0270818e43d936a3c3c10b227d97f693ab057d2",
	name: "listSubscriptions",
	filename: "src/lib/subscriptions.functions.ts"
}, (opts) => listSubscriptions.__executeServer(opts));
var listSubscriptions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listSubscriptions_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data, error } = await supabase.from("sms_subscriptions").select("id, active, frequency, created_at, commodity:commodities(id,name,category,unit_of_measure)").eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return { subscriptions: data ?? [] };
});
var createSchema = z.object({
	commodityId: z.string().uuid(),
	frequency: z.enum(["daily", "weekly"]).default("daily")
});
var createSubscription_createServerFn_handler = createServerRpc({
	id: "4fbc6da2ab4aa04a6a8a2c34de712dc592acee5d52f091572a8bed8cbce81b9b",
	name: "createSubscription",
	filename: "src/lib/subscriptions.functions.ts"
}, (opts) => createSubscription.__executeServer(opts));
var createSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => createSchema.parse(input)).handler(createSubscription_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: row, error } = await supabase.from("sms_subscriptions").insert({
		user_id: userId,
		commodity_id: data.commodityId,
		frequency: data.frequency
	}).select("id, active, frequency, commodity:commodities(id,name,category)").single();
	if (error) throw new Error(error.message);
	return { subscription: row };
});
var toggleSchema = z.object({
	id: z.string().uuid(),
	active: z.boolean()
});
var toggleSubscription_createServerFn_handler = createServerRpc({
	id: "033667c913ae56469aafaeabfe0bb307b255c02bdc29f23d0a370ba6275ee32b",
	name: "toggleSubscription",
	filename: "src/lib/subscriptions.functions.ts"
}, (opts) => toggleSubscription.__executeServer(opts));
var toggleSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => toggleSchema.parse(input)).handler(toggleSubscription_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { error } = await supabase.from("sms_subscriptions").update({ active: data.active }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteSchema = z.object({ id: z.string().uuid() });
var deleteSubscription_createServerFn_handler = createServerRpc({
	id: "d652fc387ba51bccc0f3320556f7f74bca720169f0d68460150cbf4483faf479",
	name: "deleteSubscription",
	filename: "src/lib/subscriptions.functions.ts"
}, (opts) => deleteSubscription.__executeServer(opts));
var deleteSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => deleteSchema.parse(input)).handler(deleteSubscription_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { error } = await supabase.from("sms_subscriptions").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createSubscription_createServerFn_handler, deleteSubscription_createServerFn_handler, listSubscriptions_createServerFn_handler, toggleSubscription_createServerFn_handler };
