import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as requireSupabaseAuth } from "./auth-middleware-nRAWUjb7.js";
import { t as createSsrRpc } from "./createSsrRpc-6TodB_Q1.js";
import { z } from "zod";
//#region src/lib/prices.functions.ts
/**
* Public Supabase client (publishable key, no session).
* Used for read-only price queries that anyone (even logged-out) can run.
* RLS policies still apply — markets/commodities/prices have "Public read" policies.
*/
var listPricesSchema = z.object({
	marketId: z.string().uuid().optional(),
	commodityId: z.string().uuid().optional(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	limit: z.number().int().min(1).max(500).default(100)
});
var listPrices = createServerFn({ method: "GET" }).inputValidator((input) => listPricesSchema.parse(input)).handler(createSsrRpc("eee3e1f498ce72252a6c0b4ff5e16a2c290edc99ace864c5cc8377e8d4cf6f8c"));
var latestSchema = z.object({
	commodityId: z.string().uuid().optional(),
	marketId: z.string().uuid().optional()
});
createServerFn({ method: "GET" }).inputValidator((input) => latestSchema.parse(input)).handler(createSsrRpc("9c769814b8c94cae80fb03c608865601d5165c9c607ee6ca237fd03de6549f96"));
var trendsSchema = z.object({
	commodityId: z.string().uuid(),
	marketId: z.string().uuid().optional(),
	days: z.number().int().min(1).max(365).default(30)
});
createServerFn({ method: "GET" }).inputValidator((input) => trendsSchema.parse(input)).handler(createSsrRpc("4b307f313d2dc4df5c2d69e166789922ea08512a495d0183d10501de2042f373"));
var compareSchema = z.object({ commodityId: z.string().uuid() });
createServerFn({ method: "GET" }).inputValidator((input) => compareSchema.parse(input)).handler(createSsrRpc("93a12b46deca1ae195fb14d8e3a2b161e574bd35f0a342182f87d95592135e7f"));
var createPriceSchema = z.object({
	commodityId: z.string().uuid(),
	marketId: z.string().uuid(),
	priceGhs: z.number().positive().max(1e6),
	dateRecorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
var createPrice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => createPriceSchema.parse(input)).handler(createSsrRpc("391b4fee013d02c747f0dcb6b56a3754cef2b6aef8a3c9945f8dc7ae5539f475"));
var updatePriceSchema = z.object({
	id: z.string().uuid(),
	priceGhs: z.number().positive().max(1e6).optional(),
	dateRecorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
var updatePrice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => updatePriceSchema.parse(input)).handler(createSsrRpc("a65c8f90a9a3ee4a6ac67b90a3a8109b073901a8d36dcc8a23872d99aab49821"));
var deletePriceSchema = z.object({ id: z.string().uuid() });
var deletePrice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => deletePriceSchema.parse(input)).handler(createSsrRpc("c0b94b24a2ce3eb2aafdd399238dd328b77039135a067d255c7aa84af5277f3a"));
//#endregion
export { updatePrice as i, deletePrice as n, listPrices as r, createPrice as t };
