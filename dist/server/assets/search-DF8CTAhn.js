import { a as listMarkets, r as getPrices } from "./backend-prices-CcNVQLXD.js";
import { t as AppLayout } from "./app-layout-D45RjkTW.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, t as Card } from "./card-COiwJCYN.js";
import { t as Label } from "./label-D1P78ViY.js";
import { t as Input } from "./input-xp2aZ22i.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Loader2, MapPin, Search, SlidersHorizontal, Sprout } from "lucide-react";
//#region src/routes/search.tsx?tsr-split=component
function SearchPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedMarket, setSelectedMarket] = useState("all");
	const [selectedSort, setSelectedSort] = useState("date-desc");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const { data: markets } = useQuery({
		queryKey: ["search-markets"],
		queryFn: async () => {
			return listMarkets();
		}
	});
	const { data: priceData, isLoading } = useQuery({
		queryKey: ["search-prices"],
		queryFn: async () => {
			return await getPrices({ limit: 500 });
		}
	});
	const categories = useMemo(() => {
		if (!priceData) return [];
		const cats = /* @__PURE__ */ new Set();
		priceData.forEach((p) => {
			const c = p.commodity;
			if (c?.category) cats.add(c.category);
		});
		return Array.from(cats).sort();
	}, [priceData]);
	const filteredAndSortedPrices = useMemo(() => {
		if (!priceData) return [];
		let result = [...priceData];
		if (searchTerm.trim()) {
			const query = searchTerm.toLowerCase();
			result = result.filter((p) => {
				return (p.commodity?.name?.toLowerCase())?.includes(query);
			});
		}
		if (selectedCategory !== "all") result = result.filter((p) => {
			return p.commodity?.category === selectedCategory;
		});
		if (selectedMarket !== "all") result = result.filter((p) => {
			return p.market?.id === selectedMarket;
		});
		if (startDate) result = result.filter((p) => p.date_recorded >= startDate);
		if (endDate) result = result.filter((p) => p.date_recorded <= endDate);
		result.sort((a, b) => {
			const aName = a.commodity?.name || "";
			const bName = b.commodity?.name || "";
			const aPrice = Number(a.price_ghs);
			const bPrice = Number(b.price_ghs);
			const aDate = a.date_recorded;
			const bDate = b.date_recorded;
			switch (selectedSort) {
				case "price-asc": return aPrice - bPrice;
				case "price-desc": return bPrice - aPrice;
				case "name-asc": return aName.localeCompare(bName);
				case "name-desc": return bName.localeCompare(aName);
				case "date-asc": return aDate.localeCompare(bDate);
				default: return bDate.localeCompare(aDate);
			}
		});
		return result;
	}, [
		priceData,
		searchTerm,
		selectedCategory,
		selectedMarket,
		startDate,
		endDate,
		selectedSort
	]);
	const handleReset = () => {
		setSearchTerm("");
		setSelectedCategory("all");
		setSelectedMarket("all");
		setSelectedSort("date-desc");
		setStartDate("");
		setEndDate("");
	};
	return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-bold",
					children: "Search Prices"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-muted-foreground",
					children: "Search, filter, and sort crop price observations from markets across Ghana."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-3 mb-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						type: "text",
						placeholder: "Search crops and vegetables (e.g. Tomatoes, Maize, Yam, Okra)...",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						className: "pl-9 h-11"
					})]
				}), /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: handleReset,
					className: "h-11",
					children: "Reset Filters"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 lg:grid-cols-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "lg:col-span-1 space-y-6",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "border-border/60 shadow-[var(--shadow-card)]",
						children: [/* @__PURE__ */ jsxs(CardHeader, {
							className: "pb-3 flex flex-row items-center gap-2",
							children: [/* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4.5 w-4.5 text-primary" }), /* @__PURE__ */ jsx(CardTitle, {
								className: "font-display text-base font-bold",
								children: "Filters"
							})]
						}), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "search-category",
										children: "Category"
									}), /* @__PURE__ */ jsxs("select", {
										id: "search-category",
										value: selectedCategory,
										onChange: (e) => setSelectedCategory(e.target.value),
										className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
										children: [/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All Categories"
										}), categories.map((cat) => /* @__PURE__ */ jsx("option", {
											value: cat,
											children: cat
										}, cat))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "search-market",
										children: "Market"
									}), /* @__PURE__ */ jsxs("select", {
										id: "search-market",
										value: selectedMarket,
										onChange: (e) => setSelectedMarket(e.target.value),
										className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
										children: [/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All Markets"
										}), markets?.map((m) => /* @__PURE__ */ jsx("option", {
											value: m.id,
											children: m.name
										}, m.id))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "search-start-date",
										children: "From Date"
									}), /* @__PURE__ */ jsx(Input, {
										id: "search-start-date",
										type: "date",
										value: startDate,
										onChange: (e) => setStartDate(e.target.value)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "search-end-date",
										children: "To Date"
									}), /* @__PURE__ */ jsx(Input, {
										id: "search-end-date",
										type: "date",
										value: endDate,
										onChange: (e) => setEndDate(e.target.value)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "search-sort",
										children: "Sort By"
									}), /* @__PURE__ */ jsxs("select", {
										id: "search-sort",
										value: selectedSort,
										onChange: (e) => setSelectedSort(e.target.value),
										className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "date-desc",
												children: "Date (Newest first)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "date-asc",
												children: "Date (Oldest first)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "price-desc",
												children: "Price (Highest first)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "price-asc",
												children: "Price (Lowest first)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "name-asc",
												children: "Commodity Name (A-Z)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "name-desc",
												children: "Commodity Name (Z-A)"
											})
										]
									})]
								})
							]
						})]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "lg:col-span-3",
					children: isLoading ? /* @__PURE__ */ jsx("div", {
						className: "flex justify-center items-center py-24",
						children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })
					}) : filteredAndSortedPrices.length === 0 ? /* @__PURE__ */ jsx(Card, {
						className: "border-border/60 shadow-[var(--shadow-card)] py-12",
						children: /* @__PURE__ */ jsxs(CardContent, {
							className: "text-center",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-base text-muted-foreground mb-2",
								children: "No matching prices found."
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground/80 max-w-sm mx-auto",
								children: "Try adjusting your search keywords, category filters, or selecting a wider date range."
							})]
						})
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex items-center justify-between text-xs text-muted-foreground px-1",
							children: /* @__PURE__ */ jsxs("span", { children: [
								"Showing ",
								filteredAndSortedPrices.length,
								" results"
							] })
						}), /* @__PURE__ */ jsx("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: filteredAndSortedPrices.map((row) => /* @__PURE__ */ jsx(Card, {
								className: "border-border/60 shadow-[var(--shadow-card)] hover:border-border hover:shadow-md transition-all",
								children: /* @__PURE__ */ jsxs(CardContent, {
									className: "p-4 flex items-start gap-4",
									children: [/* @__PURE__ */ jsx("span", {
										className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start justify-between gap-2",
												children: [/* @__PURE__ */ jsx("h3", {
													className: "font-display font-semibold text-base leading-tight truncate",
													children: row.commodity?.name
												}), /* @__PURE__ */ jsxs("span", {
													className: "font-display font-bold text-base text-right shrink-0 whitespace-nowrap",
													children: ["₵", Number(row.price_ghs).toFixed(2)]
												})]
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "text-xs text-muted-foreground truncate mt-0.5",
												children: [
													"Category: ",
													row.commodity?.category,
													" · Unit:",
													" ",
													row.commodity?.unit_of_measure
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-4 mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "flex items-center gap-1 min-w-0",
													children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "truncate",
														children: row.market?.name
													})]
												}), /* @__PURE__ */ jsxs("span", {
													className: "flex items-center gap-1 shrink-0 ml-auto",
													children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: row.date_recorded })]
												})]
											})
										]
									})]
								})
							}, row.id))
						})]
					})
				})]
			})
		]
	}) });
}
//#endregion
export { SearchPage as component };
