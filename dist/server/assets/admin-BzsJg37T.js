import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.js";
import { t as mockSupabase } from "./mock-client-BgqKkggR.js";
import { t as requireSupabaseAuth } from "./auth-middleware-nRAWUjb7.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
//#region src/routes/admin.tsx?tss-serverfn-split
function adminClient() {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	if (!SUPABASE_URL || SUPABASE_URL.includes("your-project") || SUPABASE_URL.includes("fbrcnxwypiccqazgyxbz") || process.env.VITE_USE_MOCK_SUPABASE === "true") return mockSupabase;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
	return createClient(process.env.SUPABASE_URL, serviceKey, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} });
}
async function ensureAdmin(supabaseClient, userId) {
	const { data: isAdmin } = await supabaseClient.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden: Admin access required.");
}
var adminListUsers_createServerFn_handler = createServerRpc({
	id: "0a0bf57d7b6efb2f314e1a37c175354f200c3fa4d8029f46951a0077d9a9f431",
	name: "adminListUsers",
	filename: "src/routes/admin.tsx"
}, (opts) => adminListUsers.__executeServer(opts));
var adminListUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(adminListUsers_createServerFn_handler, async ({ context }) => {
	const { supabase: userSupabase, userId } = context;
	await ensureAdmin(userSupabase, userId);
	const client = adminClient();
	const { data: profiles, error: pErr } = await client.from("profiles").select("id, full_name, phone, region, created_at").order("created_at", { ascending: false });
	if (pErr) throw new Error(pErr.message);
	const { data: roles, error: rErr } = await client.from("user_roles").select("user_id, role");
	if (rErr) throw new Error(rErr.message);
	return { users: (profiles ?? []).map((p) => {
		const pRoles = (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role);
		return {
			...p,
			roles: pRoles
		};
	}) };
});
var changeRoleSchema = z.object({
	targetUserId: z.string().uuid(),
	role: z.enum([
		"farmer",
		"data_officer",
		"admin"
	])
});
var adminChangeUserRole_createServerFn_handler = createServerRpc({
	id: "68b7dc5ef20f7ffa6aafb0badcff36b70e38a45a1d4e3011e25753b2c2e56de8",
	name: "adminChangeUserRole",
	filename: "src/routes/admin.tsx"
}, (opts) => adminChangeUserRole.__executeServer(opts));
var adminChangeUserRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => changeRoleSchema.parse(input)).handler(adminChangeUserRole_createServerFn_handler, async ({ data, context }) => {
	const { supabase: userSupabase, userId } = context;
	await ensureAdmin(userSupabase, userId);
	const client = adminClient();
	const { error: delErr } = await client.from("user_roles").delete().eq("user_id", data.targetUserId);
	if (delErr) throw new Error(delErr.message);
	const { error: insErr } = await client.from("user_roles").insert({
		user_id: data.targetUserId,
		role: data.role
	});
	if (insErr) throw new Error(insErr.message);
	await client.from("audit_log").insert({
		user_id: userId,
		action: "update_role",
		table_name: "user_roles",
		record_id: data.targetUserId,
		details: { role: data.role }
	});
	return { success: true };
});
var adminListAuditLogs_createServerFn_handler = createServerRpc({
	id: "0ed8c2e1fe0e1bd99f34b5579c3c8a8c933aa00d42dfacb3e7bc81b002fe9062",
	name: "adminListAuditLogs",
	filename: "src/routes/admin.tsx"
}, (opts) => adminListAuditLogs.__executeServer(opts));
var adminListAuditLogs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(adminListAuditLogs_createServerFn_handler, async ({ context }) => {
	const { supabase: userSupabase, userId } = context;
	await ensureAdmin(userSupabase, userId);
	const client = adminClient();
	const { data: logs, error: lErr } = await client.from("audit_log").select("id, user_id, action, table_name, record_id, details, created_at").order("created_at", { ascending: false }).limit(100);
	if (lErr) throw new Error(lErr.message);
	const userIds = Array.from(new Set((logs ?? []).map((l) => l.user_id).filter((id) => id != null)));
	const profilesMap = /* @__PURE__ */ new Map();
	if (userIds.length > 0) {
		const { data: profiles, error: pErr } = await client.from("profiles").select("id, full_name").in("id", userIds);
		if (!pErr && profiles) profiles.forEach((p) => profilesMap.set(p.id, p.full_name ?? ""));
	}
	return { logs: (logs ?? []).map((l) => ({
		...l,
		user_name: l.user_id ? profilesMap.get(l.user_id) || "Unknown User" : "System"
	})) };
});
var bulkImportSchema = z.object({ prices: z.array(z.object({
	marketId: z.string().uuid(),
	commodityId: z.string().uuid(),
	priceGhs: z.number().positive(),
	dateRecorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})) });
var adminBulkImportPrices_createServerFn_handler = createServerRpc({
	id: "db93b73ca5ea47be0eb6257e9edbb91e33349c411592267c7c9d89a938c50d36",
	name: "adminBulkImportPrices",
	filename: "src/routes/admin.tsx"
}, (opts) => adminBulkImportPrices.__executeServer(opts));
var adminBulkImportPrices = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => bulkImportSchema.parse(input)).handler(adminBulkImportPrices_createServerFn_handler, async ({ data, context }) => {
	const { supabase: userSupabase, userId } = context;
	await ensureAdmin(userSupabase, userId);
	const client = adminClient();
	const imported = [];
	const errors = [];
	for (let i = 0; i < data.prices.length; i++) {
		const p = data.prices[i];
		try {
			const { data: row, error: insErr } = await client.from("prices").insert({
				commodity_id: p.commodityId,
				market_id: p.marketId,
				price_ghs: p.priceGhs,
				date_recorded: p.dateRecorded,
				recorded_by: userId
			}).select("id").single();
			if (insErr) throw insErr;
			imported.push(row.id);
			await client.from("audit_log").insert({
				user_id: userId,
				action: "create",
				table_name: "prices",
				record_id: row.id,
				details: {
					...p,
					bulk: true
				}
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			errors.push({
				index: i,
				price: p,
				error: message
			});
		}
	}
	return {
		successCount: imported.length,
		errorCount: errors.length,
		errors
	};
});
var adminTriggerSMSAlerts_createServerFn_handler = createServerRpc({
	id: "9bdf53a1577ff7b70a9687264bba4a30b281151a1b926c8c0ba640a84a438c66",
	name: "adminTriggerSMSAlerts",
	filename: "src/routes/admin.tsx"
}, (opts) => adminTriggerSMSAlerts.__executeServer(opts));
var adminTriggerSMSAlerts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(adminTriggerSMSAlerts_createServerFn_handler, async ({ context }) => {
	const { supabase: userSupabase, userId } = context;
	await ensureAdmin(userSupabase, userId);
	const client = adminClient();
	const { data: subRows, error: subErr } = await client.from("sms_subscriptions").select("id, commodity_id, active, commodity:commodities(name,unit_of_measure), profile:profiles(phone)").eq("active", true);
	if (subErr) throw new Error(subErr.message);
	const subscriptions = (subRows ?? []).filter((r) => r.profile && r.profile.phone && r.commodity).map((r) => ({
		id: r.id,
		commodity_id: r.commodity_id,
		commodity_name: r.commodity.name,
		unit_of_measure: r.commodity.unit_of_measure,
		phone: r.profile.phone
	}));
	const { data: priceRows, error: priceErr } = await client.from("prices").select("price_ghs, date_recorded, commodity_id, market_id, market:markets(name,region)").order("date_recorded", { ascending: false }).order("created_at", { ascending: false }).limit(1e3);
	if (priceErr) throw new Error(priceErr.message);
	const latestPrices = /* @__PURE__ */ new Map();
	for (const r of priceRows ?? []) if (!latestPrices.has(r.commodity_id)) latestPrices.set(r.commodity_id, {
		commodity_id: r.commodity_id,
		price_ghs: Number(r.price_ghs),
		date_recorded: r.date_recorded,
		market_name: r.market ? r.market.name : "Unknown",
		region: r.market ? r.market.region : ""
	});
	let count = 0;
	const username = process.env.AT_USERNAME || "sandbox";
	const apiKey = process.env.AT_API_KEY;
	let atSMS = null;
	if (apiKey) try {
		const africastalking = await import("africastalking");
		atSMS = (africastalking.default || africastalking)({
			username,
			apiKey
		}).SMS;
	} catch (err) {
		console.error("Failed to load Africa's Talking inside SSR function:", err);
	}
	for (const sub of subscriptions) {
		const latest = latestPrices.get(sub.commodity_id);
		if (!latest) continue;
		const msg = `AgriFarm: ${sub.commodity_name} - GHS ${Number(latest.price_ghs).toFixed(2)}/${sub.unit_of_measure} (${latest.market_name}, ${latest.region}). Reply STOP to unsubscribe.`;
		if (atSMS) await atSMS.send({
			to: [sub.phone],
			message: msg
		});
		else console.log(`[MOCK BROADCAST] To: ${sub.phone} | Msg: "${msg}"`);
		count++;
	}
	return { count };
});
//#endregion
export { adminBulkImportPrices_createServerFn_handler, adminChangeUserRole_createServerFn_handler, adminListAuditLogs_createServerFn_handler, adminListUsers_createServerFn_handler, adminTriggerSMSAlerts_createServerFn_handler };
