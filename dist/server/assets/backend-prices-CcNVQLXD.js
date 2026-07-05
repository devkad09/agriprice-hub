import { t as AUTH_TOKEN_KEY } from "./use-auth-5Qohn5zI.js";
//#region src/lib/backend-prices.ts
function getToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(AUTH_TOKEN_KEY);
}
function buildHeaders(options = {}) {
	const token = getToken();
	const headers = { ...options.headers };
	if (options.body !== void 0 && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
	if (token) headers["Authorization"] = `Bearer ${token}`;
	return headers;
}
async function fetchJson(path, options = {}) {
	const baseUrl = typeof window === "undefined" ? process.env.VITE_BACKEND_URL || "http://localhost:5001" : "";
	const absoluteUrl = path.startsWith("http") ? path : `${baseUrl}${path}`;
	const init = {
		...options,
		headers: buildHeaders(options),
		body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : void 0
	};
	const response = await fetch(absoluteUrl, init);
	const text = await response.text();
	const data = text ? JSON.parse(text) : null;
	if (!response.ok) {
		const message = data?.error || data?.message || response.statusText;
		throw new Error(message || "Request failed");
	}
	return data;
}
async function listMarkets() {
	return await fetchJson("/api/markets") ?? [];
}
async function listCommodities() {
	return await fetchJson("/api/commodities") ?? [];
}
async function getPrices(filters) {
	const params = new URLSearchParams();
	if (filters?.recordedBy) params.set("recorded_by", filters.recordedBy);
	if (filters?.marketId) params.set("market_id", filters.marketId);
	if (filters?.commodityId) params.set("commodity_id", filters.commodityId);
	if (filters?.date) params.set("date", filters.date);
	if (filters?.limit) params.set("limit", String(filters.limit));
	return await fetchJson(`/api/prices${params.toString() ? `?${params.toString()}` : ""}`) ?? [];
}
async function addPrice(payload) {
	return await fetchJson("/api/prices", {
		method: "POST",
		body: {
			commodity_id: payload.commodityId,
			market_id: payload.marketId,
			price_ghs: payload.priceGhs,
			date_recorded: payload.dateRecorded
		}
	});
}
async function updatePrice(payload) {
	return await fetchJson(`/api/prices/${payload.id}`, {
		method: "PUT",
		body: {
			price_ghs: payload.priceGhs,
			date_recorded: payload.dateRecorded
		}
	});
}
async function deletePrice(id) {
	return await fetchJson(`/api/prices/${id}`, { method: "DELETE" });
}
//#endregion
export { listMarkets as a, listCommodities as i, deletePrice as n, updatePrice as o, getPrices as r, addPrice as t };
