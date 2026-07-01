import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as requireSupabaseAuth } from "./auth-middleware-nRAWUjb7.js";
import { t as createSsrRpc } from "./createSsrRpc-6TodB_Q1.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-Bc92dpZO.js");
var Route = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin Console — AgriFarm" }, {
		name: "description",
		content: "Admin Dashboard for managing users, audit logs, and bulk CSV imports."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var adminListUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0a0bf57d7b6efb2f314e1a37c175354f200c3fa4d8029f46951a0077d9a9f431"));
var changeRoleSchema = z.object({
	targetUserId: z.string().uuid(),
	role: z.enum([
		"farmer",
		"data_officer",
		"admin"
	])
});
var adminChangeUserRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => changeRoleSchema.parse(input)).handler(createSsrRpc("68b7dc5ef20f7ffa6aafb0badcff36b70e38a45a1d4e3011e25753b2c2e56de8"));
var adminListAuditLogs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0ed8c2e1fe0e1bd99f34b5579c3c8a8c933aa00d42dfacb3e7bc81b002fe9062"));
var bulkImportSchema = z.object({ prices: z.array(z.object({
	marketId: z.string().uuid(),
	commodityId: z.string().uuid(),
	priceGhs: z.number().positive(),
	dateRecorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})) });
var adminBulkImportPrices = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => bulkImportSchema.parse(input)).handler(createSsrRpc("db93b73ca5ea47be0eb6257e9edbb91e33349c411592267c7c9d89a938c50d36"));
var adminTriggerSMSAlerts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9bdf53a1577ff7b70a9687264bba4a30b281151a1b926c8c0ba640a84a438c66"));
//#endregion
export { adminListUsers as a, adminListAuditLogs as i, adminBulkImportPrices as n, adminTriggerSMSAlerts as o, adminChangeUserRole as r, Route as t };
