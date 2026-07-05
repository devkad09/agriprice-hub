import { n as deletePrice, o as updatePrice, r as getPrices } from "./backend-prices-CcNVQLXD.js";
import { t as AppLayout } from "./app-layout-D45RjkTW.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, t as Card } from "./card-COiwJCYN.js";
import { t as Label } from "./label-D1P78ViY.js";
import { t as Input } from "./input-xp2aZ22i.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D_Vx4WtS.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DBgGEUH3.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
//#region src/routes/officer.manage-prices.tsx?tsr-split=component
function ManagePricesPage() {
	return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-bold",
				children: "Manage Prices"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-muted-foreground",
				children: "View, edit, and delete recorded price entries."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6",
				children: /* @__PURE__ */ jsx(RecentEntriesTable, {})
			})
		]
	}) });
}
function RecentEntriesTable() {
	const queryClient = useQueryClient();
	const [editingPrice, setEditingPrice] = useState(null);
	const [editPriceVal, setEditPriceVal] = useState("");
	const [editDateVal, setEditDateVal] = useState("");
	const [deletingPrice, setDeletingPrice] = useState(null);
	const { data: entries, isLoading, error } = useQuery({
		queryKey: ["manage-prices"],
		queryFn: async () => {
			return getPrices({ limit: 500 });
		}
	});
	const updateMutation = useMutation({
		mutationFn: async (payload) => {
			return updatePrice(payload);
		},
		onSuccess: () => {
			toast.success("Price entry updated successfully!");
			setEditingPrice(null);
			queryClient.invalidateQueries({ queryKey: ["manage-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to update price entry");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			return deletePrice(id);
		},
		onSuccess: () => {
			toast.success("Price entry deleted.");
			setDeletingPrice(null);
			queryClient.invalidateQueries({ queryKey: ["manage-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to delete price entry");
		}
	});
	const handleEditClick = (price) => {
		setEditingPrice(price);
		setEditPriceVal(String(price.price_ghs));
		setEditDateVal(price.date_recorded);
	};
	const handleUpdateSubmit = (e) => {
		e.preventDefault();
		if (!editingPrice) return;
		const val = parseFloat(editPriceVal);
		if (isNaN(val) || val <= 0) {
			toast.error("Price must be a valid positive number.");
			return;
		}
		updateMutation.mutate({
			id: editingPrice.id,
			priceGhs: val,
			dateRecorded: editDateVal
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Card, {
			className: "border-border/60 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "Recorded Prices"
			}) }), /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })
			}) : error ? /* @__PURE__ */ jsx("p", {
				className: "text-center py-8 text-sm text-destructive",
				children: "Failed to load prices."
			}) : !entries?.length ? /* @__PURE__ */ jsx("p", {
				className: "text-center py-12 text-sm text-muted-foreground",
				children: "No prices recorded yet."
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
								children: "Price"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Date"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 text-right font-medium",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: entries.map((entry) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 pr-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: entry.commodity?.name ?? "—"
								}), /* @__PURE__ */ jsxs("span", {
									className: "ml-1.5 text-xs text-muted-foreground",
									children: ["/ ", entry.commodity?.unit_of_measure]
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 pr-4 text-muted-foreground",
								children: entry.market?.name ?? "—"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 pr-4 text-right font-display font-semibold",
								children: ["₵", Number(entry.price_ghs).toFixed(2)]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 pr-4 text-muted-foreground whitespace-nowrap",
								children: entry.date_recorded
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 text-right whitespace-nowrap",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex justify-end gap-1.5",
									children: [/* @__PURE__ */ jsxs(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => handleEditClick(entry),
										className: "h-8 w-8 hover:text-primary hover:bg-primary/5",
										children: [/* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
											className: "sr-only",
											children: "Edit"
										})]
									}), /* @__PURE__ */ jsxs(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => setDeletingPrice(entry),
										className: "h-8 w-8 hover:text-destructive hover:bg-destructive/5",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
											className: "sr-only",
											children: "Delete"
										})]
									})]
								})
							})
						]
					}, entry.id)) })]
				})
			}) })]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: editingPrice !== null,
			onOpenChange: (open) => !open && setEditingPrice(null),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-[425px]",
				children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Price Entry" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdateSubmit,
					className: "space-y-4 py-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block",
								children: "Commodity"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: editingPrice?.commodity?.name
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block",
								children: "Market"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: editingPrice?.market?.name
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "edit-price",
								children: "Price (GHS)"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("span", {
									className: "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm",
									children: "₵"
								}), /* @__PURE__ */ jsx(Input, {
									id: "edit-price",
									type: "number",
									step: "0.01",
									min: "0.01",
									value: editPriceVal,
									onChange: (e) => setEditPriceVal(e.target.value),
									className: "pl-7",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "edit-date",
								children: "Date Recorded"
							}), /* @__PURE__ */ jsx(Input, {
								id: "edit-date",
								type: "date",
								value: editDateVal,
								onChange: (e) => setEditDateVal(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, {
							className: "pt-4",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditingPrice(null),
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: updateMutation.isPending,
								children: updateMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Saving..."] }) : "Save Changes"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ jsx(AlertDialog, {
			open: deletingPrice !== null,
			onOpenChange: (open) => !open && setDeletingPrice(null),
			children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Price Entry?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
				"Are you sure you want to delete the recorded price of ",
				/* @__PURE__ */ jsxs("span", {
					className: "font-semibold text-foreground",
					children: ["₵", Number(deletingPrice?.price_ghs).toFixed(2)]
				}),
				" for ",
				/* @__PURE__ */ jsx("span", {
					className: "font-semibold text-foreground",
					children: deletingPrice?.commodity?.name
				}),
				" at ",
				/* @__PURE__ */ jsx("span", {
					className: "font-semibold text-foreground",
					children: deletingPrice?.market?.name
				}),
				"? This action cannot be undone."
			] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
				onClick: () => deletingPrice && deleteMutation.mutate(deletingPrice.id),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				disabled: deleteMutation.isPending,
				children: deleteMutation.isPending ? "Deleting..." : "Delete"
			})] })] })
		})
	] });
}
//#endregion
export { ManagePricesPage as component };
