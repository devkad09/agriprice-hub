import { t as supabase } from "./client-BmsDyj3x.js";
import { t as Route } from "./markets._marketId-C82x-YvE.js";
import { n as CardContent, o as Button, t as Card } from "./card-De5G926P.js";
import { t as SiteHeader } from "./site-header-dDAbAvco.js";
import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BarChart3, Loader2, MapPin, Minus, TrendingDown, TrendingUp } from "lucide-react";
//#region src/routes/markets.$marketId.tsx?tsr-split=component
function MarketDetailPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-20",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}),
			children: /* @__PURE__ */ jsx(MarketContent, {})
		})]
	});
}
function MarketContent() {
	const { marketId } = Route.useParams();
	const { data: market } = useQuery({
		queryKey: ["market-detail", marketId],
		queryFn: async () => {
			const { data, error } = await supabase.from("markets").select("*").eq("id", marketId).single();
			if (error) throw error;
			return data;
		}
	});
	const { data: prices, isLoading } = useQuery({
		queryKey: ["market-prices", marketId],
		queryFn: async () => {
			const { data: rows, error } = await supabase.from("prices").select("id, price_ghs, date_recorded, commodity_id, commodity:commodities(id,name,unit_of_measure,category)").eq("market_id", marketId).order("date_recorded", { ascending: false }).order("created_at", { ascending: false }).limit(500);
			if (error) throw error;
			const latestMap = /* @__PURE__ */ new Map();
			const prevMap = /* @__PURE__ */ new Map();
			for (const r of rows ?? []) {
				const c = r.commodity;
				if (!c) continue;
				if (!latestMap.has(c.id)) latestMap.set(c.id, {
					id: r.id,
					commodityName: c.name,
					unit: c.unit_of_measure,
					category: c.category,
					commodityId: c.id,
					price: Number(r.price_ghs),
					date: r.date_recorded,
					prevPrice: null
				});
				else if (!prevMap.has(c.id)) prevMap.set(c.id, Number(r.price_ghs));
			}
			return Array.from(latestMap.values()).map((item) => ({
				...item,
				prevPrice: prevMap.get(item.commodityId) ?? null
			})).sort((a, b) => a.category.localeCompare(b.category) || a.commodityName.localeCompare(b.commodityName));
		}
	});
	if (!market) return /* @__PURE__ */ jsx("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-20",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
		})
	});
	return /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				className: "mb-4 -ml-2",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), " Back to markets"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(MapPin, { className: "h-7 w-7" })
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h1", {
						className: "font-display text-3xl font-bold",
						children: market.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-muted-foreground",
						children: [market.region, " Region"]
					}),
					market.description && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: market.description
					})
				] })]
			}),
			/* @__PURE__ */ jsx(Card, {
				className: "mt-8 border-border/60 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ jsx(CardContent, {
					className: "p-0",
					children: isLoading ? /* @__PURE__ */ jsx("div", {
						className: "flex justify-center py-12",
						children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
					}) : !prices?.length ? /* @__PURE__ */ jsx("p", {
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "No prices recorded for this market yet."
					}) : /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-3 font-medium",
										children: "Commodity"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-3 font-medium",
										children: "Category"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-3 text-right font-medium",
										children: "Price (GHS)"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-3 font-medium",
										children: "Change"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-3 font-medium",
										children: "Date"
									}),
									/* @__PURE__ */ jsx("th", { className: "px-6 py-3 font-medium" })
								]
							}) }), /* @__PURE__ */ jsx("tbody", { children: prices.map((row) => {
								const change = row.prevPrice !== null ? (row.price - row.prevPrice) / row.prevPrice * 100 : null;
								return /* @__PURE__ */ jsxs("tr", {
									className: "border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors",
									children: [
										/* @__PURE__ */ jsxs("td", {
											className: "px-6 py-4",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-medium",
												children: row.commodityName
											}), /* @__PURE__ */ jsxs("span", {
												className: "ml-1.5 text-xs text-muted-foreground",
												children: ["/ ", row.unit]
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsx("span", {
												className: "rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary",
												children: row.category
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4 text-right font-display text-base font-semibold",
											children: row.price.toFixed(2)
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: change !== null ? /* @__PURE__ */ jsxs("span", {
												className: `inline-flex items-center gap-0.5 text-xs font-medium ${change > 0 ? "text-emerald-600" : change < 0 ? "text-red-500" : "text-muted-foreground"}`,
												children: [
													change > 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }) : change < 0 ? /* @__PURE__ */ jsx(TrendingDown, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" }),
													change > 0 ? "+" : "",
													change.toFixed(1),
													"%"
												]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-xs text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4 text-muted-foreground",
											children: row.date
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ jsx(Button, {
												asChild: true,
												variant: "ghost",
												size: "sm",
												children: /* @__PURE__ */ jsx(Link, {
													to: "/prices",
													search: { commodity: row.commodityId },
													children: /* @__PURE__ */ jsx(BarChart3, { className: "h-3.5 w-3.5" })
												})
											})
										})
									]
								}, row.id);
							}) })]
						})
					})
				})
			})
		]
	});
}
//#endregion
export { MarketDetailPage as component };
