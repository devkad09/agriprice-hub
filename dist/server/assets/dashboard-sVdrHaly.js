import { t as supabase } from "./client-BmsDyj3x.js";
import { a as CardTitle, i as CardHeader, l as useAuth, n as CardContent, o as Button, t as Card } from "./card-De5G926P.js";
import { t as SiteHeader } from "./site-header-dDAbAvco.js";
import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, Bell, Loader2, MapPin, Sprout, TrendingUp } from "lucide-react";
//#region src/routes/dashboard.tsx?tsr-split=component
function DashboardPage() {
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	useEffect(() => {
		if (!authLoading && !user) navigate({
			to: "/auth",
			replace: true
		});
	}, [
		user,
		authLoading,
		navigate
	]);
	if (authLoading || !user) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-display text-3xl font-bold",
						children: "Dashboard"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-muted-foreground",
						children: ["Welcome back, ", user.user_metadata?.full_name || user.email?.split("@")[0]]
					})]
				}),
				/* @__PURE__ */ jsx(StatsCards, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 grid gap-8 lg:grid-cols-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-2",
						children: /* @__PURE__ */ jsx(LatestPricesTable, {})
					}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(RecentActivity, {}) })]
				})
			]
		})]
	});
}
function StatsCards() {
	const { data: markets } = useQuery({
		queryKey: ["stats-markets"],
		queryFn: async () => {
			const { count } = await supabase.from("markets").select("*", {
				count: "exact",
				head: true
			});
			return count ?? 0;
		}
	});
	const { data: commodities } = useQuery({
		queryKey: ["stats-commodities"],
		queryFn: async () => {
			const { count } = await supabase.from("commodities").select("*", {
				count: "exact",
				head: true
			});
			return count ?? 0;
		}
	});
	const { data: subs } = useQuery({
		queryKey: ["stats-subs"],
		queryFn: async () => {
			const { count } = await supabase.from("sms_subscriptions").select("*", {
				count: "exact",
				head: true
			}).eq("active", true);
			return count ?? 0;
		}
	});
	const { data: totalPrices } = useQuery({
		queryKey: ["stats-prices"],
		queryFn: async () => {
			const { count } = await supabase.from("prices").select("*", {
				count: "exact",
				head: true
			});
			return count ?? 0;
		}
	});
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				label: "Markets",
				value: markets ?? "—",
				icon: MapPin,
				color: "text-blue-600 bg-blue-50"
			},
			{
				label: "Commodities",
				value: commodities ?? "—",
				icon: Sprout,
				color: "text-primary bg-primary/10"
			},
			{
				label: "Price Entries",
				value: totalPrices ?? "—",
				icon: BarChart3,
				color: "text-amber-600 bg-amber-50"
			},
			{
				label: "Active Alerts",
				value: subs ?? "—",
				icon: Bell,
				color: "text-violet-600 bg-violet-50"
			}
		].map(({ label, value, icon: Icon, color }) => /* @__PURE__ */ jsx(Card, {
			className: "border-border/60 shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "flex items-center gap-4 p-5",
				children: [/* @__PURE__ */ jsx("span", {
					className: `grid h-11 w-11 shrink-0 place-items-center rounded-lg ${color}`,
					children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: label
				}), /* @__PURE__ */ jsx("p", {
					className: "font-display text-2xl font-bold",
					children: value
				})] })]
			})
		}, label))
	});
}
function LatestPricesTable() {
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard-latest-prices"],
		queryFn: async () => {
			const { data: rows, error } = await supabase.from("prices").select("id, price_ghs, date_recorded, commodity:commodities(name,unit_of_measure,category), market:markets(name,region)").order("date_recorded", { ascending: false }).order("created_at", { ascending: false }).limit(200);
			if (error) throw error;
			const seen = /* @__PURE__ */ new Set();
			const latest = [];
			for (const r of rows ?? []) {
				const commodity = r.commodity;
				const market = r.market;
				if (!commodity || !market) continue;
				const key = `${commodity.name}:${market.name}`;
				if (seen.has(key)) continue;
				seen.add(key);
				latest.push({
					...r,
					commodity,
					market
				});
			}
			return latest.slice(0, 15);
		}
	});
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex-row items-center justify-between pb-4",
			children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "Latest Prices"
			}), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/prices",
					children: ["View charts ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })]
				})
			})]
		}), /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-8",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : !data?.length ? /* @__PURE__ */ jsx("p", {
			className: "py-8 text-center text-sm text-muted-foreground",
			children: "No price data yet."
		}) : /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					className: "border-b text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("th", {
							className: "pb-3 pr-4 font-medium",
							children: "Commodity"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-3 pr-4 font-medium",
							children: "Market"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-3 pr-4 text-right font-medium",
							children: "Price (GHS)"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-3 font-medium",
							children: "Date"
						})
					]
				}) }), /* @__PURE__ */ jsx("tbody", { children: data.map((row) => /* @__PURE__ */ jsxs("tr", {
					className: "border-b border-border/40 last:border-0",
					children: [
						/* @__PURE__ */ jsxs("td", {
							className: "py-3 pr-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: row.commodity.name
							}), /* @__PURE__ */ jsxs("span", {
								className: "ml-1.5 text-xs text-muted-foreground",
								children: ["/ ", row.commodity.unit_of_measure]
							})]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: row.market.name
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3 pr-4 text-right font-display font-semibold",
							children: Number(row.price_ghs).toFixed(2)
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3 text-muted-foreground",
							children: row.date_recorded
						})
					]
				}, row.id)) })]
			})
		}) })]
	});
}
function RecentActivity() {
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard-recent-activity"],
		queryFn: async () => {
			const { data: rows, error } = await supabase.from("prices").select("id, price_ghs, date_recorded, created_at, commodity:commodities(name), market:markets(name)").order("created_at", { ascending: false }).limit(8);
			if (error) throw error;
			return rows;
		}
	});
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsx(CardHeader, {
			className: "pb-4",
			children: /* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "Recent Activity"
			})
		}), /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-8",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : !data?.length ? /* @__PURE__ */ jsx("p", {
			className: "py-8 text-center text-sm text-muted-foreground",
			children: "No activity yet."
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: data.map((entry) => {
				const commodity = entry.commodity;
				const market = entry.market;
				return /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm font-medium leading-tight",
							children: [
								commodity?.name ?? "—",
								" at ",
								market?.name ?? "—"
							]
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"GHS ",
								Number(entry.price_ghs).toFixed(2),
								" · ",
								entry.date_recorded
							]
						})]
					})]
				}, entry.id);
			})
		}) })]
	});
}
//#endregion
export { DashboardPage as component };
