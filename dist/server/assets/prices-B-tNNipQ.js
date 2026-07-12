import { n as marketsQuery, t as commoditiesQuery } from "./prices-Dy9v5rAt.js";
import { t as AppLayout } from "./app-layout-D45RjkTW.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, t as Card } from "./card-COiwJCYN.js";
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
	return /* @__PURE__ */ jsx(AppLayout, {
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-20",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}),
			children: /* @__PURE__ */ jsx(PricesContent, {})
		})
	});
}
function PricesContent() {
	const { data: commodities } = useSuspenseQuery(commoditiesQuery);
	const { data: markets } = useSuspenseQuery(marketsQuery);
	const [selectedCommodity, setSelectedCommodity] = useState(commodities[0]?.id ?? "");
	const [selectedRange, setSelectedRange] = useState(30);
	const [enabledMarkets, setEnabledMarkets] = useState(new Set(markets.map((m) => m.id)));
	const selectedCom = commodities.find((c) => c.id === selectedCommodity);
	const { data: trendData, isLoading: trendLoading } = useQuery({
		queryKey: [
			"price-trends",
			selectedCommodity,
			selectedRange
		],
		queryFn: async () => {
			if (!selectedCommodity) return [];
			const response = await fetch(`/api/prices/trends?commodity_id=${selectedCommodity}&days=${selectedRange}`);
			if (!response.ok) throw new Error("Failed to fetch price trends");
			return response.json();
		},
		enabled: !!selectedCommodity
	});
	const { data: compareData } = useQuery({
		queryKey: ["price-compare", selectedCommodity],
		queryFn: async () => {
			if (!selectedCommodity) return [];
			const response = await fetch(`/api/prices/compare?commodity_id=${selectedCommodity}`);
			if (!response.ok) throw new Error("Failed to fetch comparisons");
			return (await response.json()).map((r) => ({
				marketName: r.market_name,
				price: Number(r.price_ghs),
				date: r.date_recorded
			})).sort((a, b) => a.price - b.price);
		},
		enabled: !!selectedCommodity
	});
	const chartData = (() => {
		if (!trendData?.length) return [];
		const byDate = /* @__PURE__ */ new Map();
		for (const r of trendData) {
			if (!enabledMarkets.has(r.market_id)) continue;
			const entry = byDate.get(r.date_recorded) ?? { date: r.date_recorded };
			entry[r.market_name] = Number(r.price_ghs);
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
				className: "mt-6 grid gap-6 md:grid-cols-4 items-start",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "md:col-span-3 space-y-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-end gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "commodity-select",
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
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
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
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
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground block",
							children: "Filter by Market (click map dots or chips)"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-2",
							children: markets.map((m, i) => {
								const isEnabled = enabledMarkets.has(m.id);
								const color = CHART_COLORS[i % CHART_COLORS.length];
								return /* @__PURE__ */ jsxs("button", {
									onClick: () => toggleMarket(m.id),
									className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${isEnabled ? "border-transparent text-white shadow-sm scale-105" : "border-border bg-background text-muted-foreground hover:bg-muted"}`,
									style: isEnabled ? { backgroundColor: color } : void 0,
									children: [/* @__PURE__ */ jsx("span", {
										className: "h-1.5 w-1.5 rounded-full transition-transform duration-300",
										style: { backgroundColor: isEnabled ? "#ffffff" : color }
									}), m.name]
								}, m.id);
							})
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "md:col-span-1 border border-border/60 bg-card rounded-xl p-4 shadow-[var(--shadow-card)] flex flex-col items-center",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3",
						children: "Market Locations"
					}), /* @__PURE__ */ jsx(GhanaMap, {
						markets,
						enabledMarkets,
						toggleMarket,
						chartColors: CHART_COLORS
					})]
				})]
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
function GhanaMap({ markets, enabledMarkets, toggleMarket, chartColors }) {
	const marketMapInfo = {
		"Tamale": {
			x: 62,
			y: 50,
			colorIndex: 0,
			align: "right"
		},
		"Techiman": {
			x: 44,
			y: 90,
			colorIndex: 1,
			align: "left"
		},
		"Kejetia": {
			x: 42,
			y: 112,
			colorIndex: 2,
			align: "left"
		},
		"Kumasi Central": {
			x: 58,
			y: 114,
			colorIndex: 3,
			align: "right"
		},
		"Makola": {
			x: 76,
			y: 138,
			colorIndex: 4,
			align: "right"
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "relative w-full max-w-[180px] aspect-[3/4]",
		children: /* @__PURE__ */ jsxs("svg", {
			viewBox: "0 0 120 160",
			className: "w-full h-full select-none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ jsx("path", {
					d: "M 40 10 C 55 8, 70 8, 80 10 C 85 15, 82 25, 80 35 C 85 45, 90 55, 95 65 C 92 75, 92 85, 94 95 C 90 105, 82 115, 84 125 C 80 135, 75 142, 65 145 C 55 146, 45 145, 38 143 C 35 130, 25 125, 28 115 C 32 105, 28 95, 30 85 C 26 75, 25 65, 28 55 C 32 45, 35 30, 40 10 Z",
					fill: "var(--primary)",
					fillOpacity: .04,
					stroke: "var(--primary)",
					strokeWidth: 1,
					strokeDasharray: "2 2",
					className: "transition-all duration-300"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M 75 80 Q 82 95 86 115 Q 84 120 78 110 T 70 95 Z",
					fill: "oklch(0.7 0.15 190 / 0.15)",
					stroke: "oklch(0.7 0.15 190 / 0.3)",
					strokeWidth: .5
				}),
				markets.map((m) => {
					const info = marketMapInfo[m.name];
					if (!info) return null;
					const isEnabled = enabledMarkets.has(m.id);
					const color = chartColors[info.colorIndex % chartColors.length];
					return /* @__PURE__ */ jsxs("g", {
						onClick: () => toggleMarket(m.id),
						className: "cursor-pointer group",
						children: [
							isEnabled && /* @__PURE__ */ jsx("circle", {
								cx: info.x,
								cy: info.y,
								r: 6,
								fill: color,
								className: "animate-ping opacity-25"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: info.x,
								cy: info.y,
								r: isEnabled ? 4 : 3,
								fill: isEnabled ? color : "oklch(var(--muted-foreground))",
								stroke: "#ffffff",
								strokeWidth: 1,
								className: "transition-all duration-300 group-hover:r-5 group-hover:stroke-primary"
							}),
							/* @__PURE__ */ jsx("text", {
								x: info.x + (info.align === "left" ? -6 : 6),
								y: info.y + 3,
								textAnchor: info.align === "left" ? "end" : "start",
								className: `text-[8px] font-semibold transition-colors duration-300 select-none ${isEnabled ? "fill-foreground font-bold" : "fill-muted-foreground group-hover:fill-foreground"}`,
								children: m.name.replace(" Central", "")
							})
						]
					}, m.id);
				})
			]
		})
	});
}
//#endregion
export { PricesPage as component };
