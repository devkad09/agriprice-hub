import { a as listMarkets, i as listCommodities, t as addPrice } from "./backend-prices-CcNVQLXD.js";
import { t as AppLayout } from "./app-layout-D45RjkTW.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, r as CardDescription, t as Card } from "./card-COiwJCYN.js";
import { t as Label } from "./label-D1P78ViY.js";
import { t as Input } from "./input-xp2aZ22i.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
//#region src/routes/officer.add-price.tsx?tsr-split=component
function AddPricePage() {
	return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-4xl px-4 py-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-bold",
				children: "Record Price"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-muted-foreground",
				children: "Submit a daily price observation."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6",
				children: /* @__PURE__ */ jsx(PriceEntryForm, {})
			})
		]
	}) });
}
function PriceEntryForm() {
	const queryClient = useQueryClient();
	const [marketId, setMarketId] = useState("");
	const [commodityId, setCommodityId] = useState("");
	const [priceGhs, setPriceGhs] = useState("");
	const [dateRecorded, setDateRecorded] = useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const { data: markets } = useQuery({
		queryKey: ["markets-dropdown"],
		queryFn: async () => {
			return listMarkets();
		}
	});
	const { data: commodities } = useQuery({
		queryKey: ["commodities-dropdown"],
		queryFn: async () => {
			return listCommodities();
		}
	});
	useEffect(() => {
		if (markets?.length && !marketId) setMarketId(markets[0].id);
	}, [markets, marketId]);
	useEffect(() => {
		if (commodities?.length && !commodityId) setCommodityId(commodities[0].id);
	}, [commodities, commodityId]);
	const mutation = useMutation({
		mutationFn: async (payload) => {
			return addPrice(payload);
		},
		onSuccess: () => {
			toast.success("Price entry created successfully!");
			setPriceGhs("");
			queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
			queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to create price entry");
		}
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!marketId || !commodityId || !priceGhs) {
			toast.error("Please fill in all fields.");
			return;
		}
		const val = parseFloat(priceGhs);
		if (isNaN(val) || val <= 0) {
			toast.error("Price must be a valid positive number.");
			return;
		}
		mutation.mutate({
			commodityId,
			marketId,
			priceGhs: val,
			dateRecorded
		});
	};
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
			className: "font-display text-lg",
			children: "Record Daily Price"
		}), /* @__PURE__ */ jsx(CardDescription, { children: "Enter the observed price of a crop at a specific market." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "entry-market",
						children: "Market"
					}), /* @__PURE__ */ jsx("select", {
						id: "entry-market",
						value: marketId,
						onChange: (e) => setMarketId(e.target.value),
						className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
						children: markets?.map((m) => /* @__PURE__ */ jsx("option", {
							value: m.id,
							children: m.name
						}, m.id))
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "entry-commodity",
						children: "Commodity"
					}), /* @__PURE__ */ jsx("select", {
						id: "entry-commodity",
						value: commodityId,
						onChange: (e) => setCommodityId(e.target.value),
						className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
						children: commodities?.map((c) => /* @__PURE__ */ jsxs("option", {
							value: c.id,
							children: [
								c.name,
								" (",
								c.unit_of_measure,
								")"
							]
						}, c.id))
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "entry-price",
						children: "Price (GHS)"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("span", {
							className: "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm font-medium",
							children: "₵"
						}), /* @__PURE__ */ jsx(Input, {
							id: "entry-price",
							type: "number",
							step: "0.01",
							min: "0.01",
							placeholder: "0.00",
							value: priceGhs,
							onChange: (e) => setPriceGhs(e.target.value),
							className: "pl-7",
							required: true
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "entry-date",
						children: "Date Recorded"
					}), /* @__PURE__ */ jsx(Input, {
						id: "entry-date",
						type: "date",
						value: dateRecorded,
						onChange: (e) => setDateRecorded(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					className: "w-full",
					disabled: mutation.isPending,
					children: mutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Recording..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), " Record Entry"] })
				})
			]
		}) })]
	});
}
//#endregion
export { AddPricePage as component };
