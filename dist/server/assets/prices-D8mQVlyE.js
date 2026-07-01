import { t as supabase } from "./client-BmsDyj3x.js";
import { n as marketsQuery, t as commoditiesQuery } from "./prices-D7l65amk.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, t as Card } from "./card-De5G926P.js";
import { t as SiteHeader } from "./site-header-dDAbAvco.js";
import { Suspense, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/prices.tsx?tsr-split=component
var CHART_COLORS = [
	"oklch(0.55 0.15 145)",
	"oklch(0.7 0.15 80)",
	"oklch(0.5 0.1 55)",
	"oklch(0.65 0.15 35)",
	"oklch(0.45 0.1 170)"
];
var RANGES = [
	{
		label: "7d",
		days: 7
	},
	{
		label: "30d",
		days: 30
	},
	{
		label: "90d",
		days: 90
	},
	{
		label: "All",
		days: 365
	}
];
function PricesPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-20",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}),
			children: /* @__PURE__ */ jsx(PricesContent, {})
		})]
	});
}
function PricesContent() {
	const { data: commodities } = useSuspenseQuery(commoditiesQuery);
	const { data: markets } = useSuspenseQuery(marketsQuery);
	const [selectedCommodity, setSelectedCommodity] = useState(commodities[0]?.id ?? "");
	const [selectedRange, setSelectedRange] = useState(30);
	const [enabledMarkets, setEnabledMarkets] = useState(new Set(markets.map((m) => m.id)));
	const selectedCom = commodities.find((c) => c.id === selectedCommodity);
	const since = /* @__PURE__ */ new Date();
	since.setDate(since.getDate() - selectedRange);
	const sinceStr = since.toISOString().slice(0, 10);
	const { data: trendData, isLoading: trendLoading } = useQuery({
		queryKey: [
			"price-trends",
			selectedCommodity,
			sinceStr
		],
		queryFn: async () => {
			if (!selectedCommodity) return [];
			const { data: rows, error } = await supabase.from("prices").select("price_ghs, date_recorded, market_id, market:markets(id,name)").eq("commodity_id", selectedCommodity).gte("date_recorded", sinceStr).order("date_recorded", { ascending: true });
			if (error) throw error;
			return rows ?? [];
		},
		enabled: !!selectedCommodity
	});
	const { data: compareData } = useQuery({
		queryKey: ["price-compare", selectedCommodity],
		queryFn: async () => {
			if (!selectedCommodity) return [];
			const { data: rows, error } = await supabase.from("prices").select("price_ghs, date_recorded, market_id, market:markets(id,name)").eq("commodity_id", selectedCommodity).order("date_recorded", { ascending: false }).limit(500);
			if (error) throw error;
			const latest = /* @__PURE__ */ new Map();
			for (const r of rows ?? []) {
				const m = r.market;
				if (!m || latest.has(m.id)) continue;
				latest.set(m.id, {
					marketName: m.name,
					price: Number(r.price_ghs),
					date: r.date_recorded
				});
			}
			return Array.from(latest.values()).sort((a, b) => a.price - b.price);
		},
		enabled: !!selectedCommodity
	});
	const chartData = (() => {
		if (!trendData?.length) return [];
		const byDate = /* @__PURE__ */ new Map();
		for (const r of trendData) {
			const m = r.market;
			if (!m || !enabledMarkets.has(m.id)) continue;
			const entry = byDate.get(r.date_recorded) ?? { date: r.date_recorded };
			entry[m.name] = Number(r.price_ghs);
			byDate.set(r.date_recorded, entry);
		}
		return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
	})();
	const activeMarketNames = markets.filter((m) => enabledMarkets.has(m.id)).map((m) => m.name);
	function toggleMarket(id) {
		setEnabledMarkets((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-bold",
				children: "Price Charts"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-muted-foreground",
				children: "Track commodity price trends across Ghana's markets"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex flex-wrap items-end gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "commodity-select",
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Commodity"
					}), /* @__PURE__ */ jsx("select", {
						id: "commodity-select",
						value: selectedCommodity,
						onChange: (e) => setSelectedCommodity(e.target.value),
						className: "flex h-9 w-56 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
						children: commodities.map((c) => /* @__PURE__ */ jsxs("option", {
							value: c.id,
							children: [
								c.name,
								" (",
								c.unit_of_measure,
								")"
							]
						}, c.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Range"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex gap-1",
						children: RANGES.map((r) => /* @__PURE__ */ jsx(Button, {
							variant: selectedRange === r.days ? "default" : "outline",
							size: "sm",
							onClick: () => setSelectedRange(r.days),
							className: "min-w-[3rem]",
							children: r.label
						}, r.label))
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: markets.map((m, i) => /* @__PURE__ */ jsx("button", {
					onClick: () => toggleMarket(m.id),
					className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${enabledMarkets.has(m.id) ? "border-transparent text-white" : "border-border bg-background text-muted-foreground"}`,
					style: enabledMarkets.has(m.id) ? { backgroundColor: CHART_COLORS[i % CHART_COLORS.length] } : void 0,
					children: m.name
				}, m.id))
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "mt-6 border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "font-display text-lg",
						children: [selectedCom?.name ?? "—", " — Price Trends"]
					})
				}), /* @__PURE__ */ jsx(CardContent, { children: trendLoading ? /* @__PURE__ */ jsx("div", {
					className: "flex h-72 items-center justify-center",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
				}) : !chartData.length ? /* @__PURE__ */ jsx("div", {
					className: "flex h-72 items-center justify-center",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "No price data for this selection."
					})
				}) : /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 320,
					children: /* @__PURE__ */ jsxs(LineChart, {
						data: chartData,
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "oklch(0.9 0.02 130)"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								dataKey: "date",
								tick: { fontSize: 11 },
								tickFormatter: (v) => v.slice(5)
							}),
							/* @__PURE__ */ jsx(YAxis, {
								tick: { fontSize: 11 },
								tickFormatter: (v) => `₵${v}`
							}),
							/* @__PURE__ */ jsx(Tooltip, {
								contentStyle: {
									borderRadius: "0.5rem",
									border: "1px solid oklch(0.9 0.02 130)",
									fontSize: "0.8rem"
								},
								formatter: (value) => [`GHS ${value.toFixed(2)}`, void 0]
							}),
							/* @__PURE__ */ jsx(Legend, {}),
							activeMarketNames.map((name, i) => /* @__PURE__ */ jsx(Line, {
								type: "monotone",
								dataKey: name,
								stroke: CHART_COLORS[markets.findIndex((m) => m.name === name) % CHART_COLORS.length],
								strokeWidth: 2,
								dot: { r: 3 },
								activeDot: { r: 5 },
								connectNulls: true
							}, name))
						]
					})
				}) })]
			}),
			compareData && compareData.length > 0 && /* @__PURE__ */ jsxs(Card, {
				className: "mt-6 border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "font-display text-lg",
						children: [selectedCom?.name ?? "—", " — Market Comparison (Latest)"]
					})
				}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ jsxs(BarChart, {
						data: compareData,
						layout: "vertical",
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "oklch(0.9 0.02 130)"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								type: "number",
								tick: { fontSize: 11 },
								tickFormatter: (v) => `₵${v}`
							}),
							/* @__PURE__ */ jsx(YAxis, {
								type: "category",
								dataKey: "marketName",
								tick: { fontSize: 12 },
								width: 160
							}),
							/* @__PURE__ */ jsx(Tooltip, { formatter: (value) => [`GHS ${value.toFixed(2)}`, "Price"] }),
							/* @__PURE__ */ jsx(Bar, {
								dataKey: "price",
								radius: [
									0,
									6,
									6,
									0
								],
								children: compareData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i))
							})
						]
					})
				}) })]
			})
		]
	});
}
//#endregion
export { PricesPage as component };
