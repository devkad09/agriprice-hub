import { n as marketsQuery, t as commoditiesQuery } from "./routes-bfbbaAk9.js";
import { n as CardContent, o as Button, t as Card } from "./card-De5G926P.js";
import { t as SiteHeader } from "./site-header-dDAbAvco.js";
import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, MapPin, MessageSquareText, Sprout, TrendingUp } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
function Home() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(SiteHeader, {}),
			/* @__PURE__ */ jsx(Hero, {}),
			/* @__PURE__ */ jsxs(Suspense, {
				fallback: null,
				children: [
					/* @__PURE__ */ jsx(Features, {}),
					/* @__PURE__ */ jsx(MarketsSection, {}),
					/* @__PURE__ */ jsx(CommoditiesSection, {})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 -z-10",
				style: { background: "var(--gradient-leaf)" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full opacity-30 blur-3xl",
				style: { background: "var(--color-harvest)" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mx-auto max-w-6xl px-4 py-20 md:py-28",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid items-center gap-12 md:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary",
							children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }), "Live prices across Ghana"]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl",
							children: ["Know the right price ", /* @__PURE__ */ jsx("span", {
								className: "text-primary",
								children: "before market day."
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-5 max-w-xl text-lg text-muted-foreground",
							children: "AgriFarm gives Ghanaian farmers daily crop prices from 5 major markets — Makola, Kumasi, Kejetia, Techiman, and Tamale — plus SMS alerts when the price of your crop changes."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "lg",
								className: "bg-primary text-primary-foreground hover:bg-primary/90",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/auth",
									children: ["Get started free ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
								})
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ jsx("a", {
									href: "#markets",
									children: "Browse markets"
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex items-center gap-6 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "font-display text-2xl font-bold text-foreground",
									children: "5"
								}), " markets"] }),
								/* @__PURE__ */ jsx("div", { className: "h-8 w-px bg-border" }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-display text-2xl font-bold text-foreground",
										children: "20"
									}),
									" ",
									"commodities"
								] }),
								/* @__PURE__ */ jsx("div", { className: "h-8 w-px bg-border" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "font-display text-2xl font-bold text-foreground",
									children: "SMS"
								}), " alerts"] })
							]
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "relative",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-hero)]",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs uppercase tracking-wider text-muted-foreground",
										children: "Today · Makola Market"
									}), /* @__PURE__ */ jsx("p", {
										className: "font-display text-lg font-semibold",
										children: "Tomatoes (crate)"
									})] }), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary",
										children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }), " +4.2%"]
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 font-display text-4xl font-bold",
									children: "GHS 720"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-6 grid h-24 grid-cols-12 items-end gap-1.5",
									children: [
										40,
										55,
										48,
										62,
										70,
										58,
										72,
										68,
										80,
										75,
										88,
										95
									].map((h, i) => /* @__PURE__ */ jsx("div", {
										className: "rounded-t-sm bg-primary/80",
										style: {
											height: `${h}%`,
											opacity: .4 + i * .05
										}
									}, i))
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: "Past 12 days · sample preview"
								})
							]
						})
					})]
				})
			})
		]
	});
}
function Features() {
	return /* @__PURE__ */ jsx("section", {
		id: "features",
		className: "border-t border-border/60 bg-background py-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "font-display text-3xl font-bold tracking-tight md:text-4xl",
					children: "Built for the way Ghana farms."
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 max-w-2xl text-muted-foreground",
					children: "AgriFarm puts market information in every farmer's hand — from the smallholder in Bolgatanga to traders in Accra."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4",
					children: [
						{
							icon: BarChart3,
							title: "Daily prices",
							body: "Up-to-date prices entered by MoFA data officers from every major market."
						},
						{
							icon: MapPin,
							title: "Compare markets",
							body: "See which market pays best for your crop, side by side."
						},
						{
							icon: MessageSquareText,
							title: "SMS alerts",
							body: "Subscribe to a commodity and get price updates by SMS — no internet needed."
						},
						{
							icon: TrendingUp,
							title: "Price trends",
							body: "Track how prices move over weeks and months to plan when to sell."
						}
					].map(({ icon: Icon, title, body }) => /* @__PURE__ */ jsx(Card, {
						className: "border-border/60 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5",
						children: /* @__PURE__ */ jsxs(CardContent, {
							className: "p-6",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-4 font-display text-lg font-semibold",
									children: title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-sm text-muted-foreground",
									children: body
								})
							]
						})
					}, title))
				})
			]
		})
	});
}
function MarketsSection() {
	const { data } = useSuspenseQuery(marketsQuery);
	return /* @__PURE__ */ jsx("section", {
		id: "markets",
		className: "border-t border-border/60 py-20",
		style: { background: "var(--gradient-leaf)" },
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex items-end justify-between gap-6",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-3xl font-bold md:text-4xl",
					children: "5 markets, one network."
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 max-w-xl text-muted-foreground",
					children: "Prices flow in daily from these regional hubs."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: data.map((m) => /* @__PURE__ */ jsx(Card, {
					className: "group border-border/60 bg-card/90 backdrop-blur shadow-[var(--shadow-card)]",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "p-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-lg font-semibold",
								children: m.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-0.5 text-sm text-muted-foreground",
								children: [m.region, " Region"]
							})] }), /* @__PURE__ */ jsx("span", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
								children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" })
							})]
						}), m.description && /* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: m.description
						})]
					})
				}, m.id))
			})]
		})
	});
}
function CommoditiesSection() {
	const { data } = useSuspenseQuery(commoditiesQuery);
	const grouped = data.reduce((acc, c) => {
		(acc[c.category] ||= []).push(c);
		return acc;
	}, {});
	return /* @__PURE__ */ jsx("section", {
		id: "commodities",
		className: "border-t border-border/60 bg-background py-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "font-display text-3xl font-bold md:text-4xl",
					children: "20 commodities tracked."
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 max-w-xl text-muted-foreground",
					children: "From staples to cash crops — the prices farmers actually need."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3",
					children: Object.entries(grouped).map(([category, items]) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-bold uppercase tracking-wider text-primary",
							children: category
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-3 space-y-1.5",
							children: items.map((c) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: c.name
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs text-muted-foreground",
									children: c.unit_of_measure
								})]
							}, c.id))
						})]
					}, category))
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card py-10",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("span", { children: "AgriFarm · Accra Technical University FYP · Group 39" })]
			}), /* @__PURE__ */ jsxs("p", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" AgriFarm. Built for Ghanaian farmers."
			] })]
		})
	});
}
//#endregion
export { Home as component };
