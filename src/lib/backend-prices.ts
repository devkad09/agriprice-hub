import { AUTH_TOKEN_KEY } from "@/lib/use-auth";

type BackendFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function buildHeaders(options: BackendFetchOptions = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function fetchJson<T>(path: string, options: BackendFetchOptions = {}): Promise<T> {
  const baseUrl = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5001";
  const absoluteUrl = path.startsWith("http") ? path : `${baseUrl}${path}`;

  console.log(`[fetchJson] typeof window: ${typeof window}, path: ${path}, baseUrl: "${baseUrl}", absoluteUrl: "${absoluteUrl}"`);

  const init: RequestInit = {
    ...options,
    headers: buildHeaders(options),
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
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

export type MarketItem = { id: string; name: string; region?: string };
export type CommodityItem = { id: string; name: string; unit_of_measure: string; category?: string };

export async function listMarkets() {
  return (await fetchJson<MarketItem[]>("/api/markets")) ?? [];
}

export async function listCommodities() {
  return (await fetchJson<CommodityItem[]>("/api/commodities")) ?? [];
}

export type PriceRow = {
  id: string;
  price_ghs: number;
  date_recorded: string;
  commodity: { id: string; name: string; unit_of_measure: string } | null;
  market: { id: string; name: string } | null;
};

export async function getPrices(filters?: {
  recordedBy?: string;
  marketId?: string;
  commodityId?: string;
  date?: string;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.recordedBy) params.set("recorded_by", filters.recordedBy);
  if (filters?.marketId) params.set("market_id", filters.marketId);
  if (filters?.commodityId) params.set("commodity_id", filters.commodityId);
  if (filters?.date) params.set("date", filters.date);
  if (filters?.limit) params.set("limit", String(filters.limit));

  const url = `/api/prices${params.toString() ? `?${params.toString()}` : ""}`;
  return (await fetchJson<PriceRow[]>(url)) ?? [];
}

export async function addPrice(payload: {
  commodityId: string;
  marketId: string;
  priceGhs: number;
  dateRecorded: string;
}) {
  return await fetchJson<PriceRow>("/api/prices", {
    method: "POST",
    body: {
      commodity_id: payload.commodityId,
      market_id: payload.marketId,
      price_ghs: payload.priceGhs,
      date_recorded: payload.dateRecorded,
    },
  });
}

export async function updatePrice(payload: {
  id: string;
  priceGhs: number;
  dateRecorded: string;
}) {
  return await fetchJson<PriceRow>(`/api/prices/${payload.id}`, {
    method: "PUT",
    body: {
      price_ghs: payload.priceGhs,
      date_recorded: payload.dateRecorded,
    },
  });
}

export async function deletePrice(id: string) {
  return await fetchJson<{ message: string }>(`/api/prices/${id}`, {
    method: "DELETE",
  });
}
