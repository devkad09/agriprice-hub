import { t as supabase } from "./client-BmsDyj3x.js";
import { a as CardTitle, i as CardHeader, l as useAuth, n as CardContent, o as Button, r as CardDescription, t as Card } from "./card-De5G926P.js";
import { n as useRole, t as SiteHeader } from "./site-header-dDAbAvco.js";
import { t as Label } from "./label-Bvr4b2Cj.js";
import { t as Input } from "./input-a7DTiqQY.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-Dl8KLpSk.js";
import { i as updatePrice, n as deletePrice, t as createPrice } from "./prices.functions-C5G9-c4_.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DaoE4-sx.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
//#region src/routes/officer.tsx?tsr-split=component
function OfficerPage() {
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	const { canEditPrices, loading: roleLoading } = useRole();
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
	if (authLoading || roleLoading) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!user || !canEditPrices) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsx("main", {
			className: "mx-auto max-w-xl px-4 py-20 text-center",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-destructive/20 bg-destructive/5 p-8",
				children: [
					/* @__PURE__ */ jsx(ShieldAlert, { className: "mx-auto h-12 w-12 text-destructive" }),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-4 font-display text-2xl font-bold",
						children: "Access Denied"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-muted-foreground",
						children: "Only authorized Data Officers or Admins can access this panel to record price data."
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/dashboard",
							children: "Go to Dashboard"
						})
					})
				]
			})
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-bold",
					children: "Data Officer Panel"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-muted-foreground",
					children: "Record, update, and manage market price entries."
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "lg:col-span-1",
					children: /* @__PURE__ */ jsx(PriceEntryForm, {})
				}), /* @__PURE__ */ jsx("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ jsx(RecentEntriesTable, {})
				})]
			})]
		})]
	});
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
			const { data, error } = await supabase.from("markets").select("id, name").order("name");
			if (error) throw error;
			return data;
		}
	});
	const { data: commodities } = useQuery({
		queryKey: ["commodities-dropdown"],
		queryFn: async () => {
			const { data, error } = await supabase.from("commodities").select("id, name, unit_of_measure").order("name");
			if (error) throw error;
			return data;
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
			return createPrice(payload);
		},
		onSuccess: () => {
			toast.success("Price entry created successfully!");
			setPriceGhs("");
			queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
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
function RecentEntriesTable() {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const [editingPrice, setEditingPrice] = useState(null);
	const [editPriceVal, setEditPriceVal] = useState("");
	const [editDateVal, setEditDateVal] = useState("");
	const [deletingPrice, setDeletingPrice] = useState(null);
	const { data: entries, isLoading, error } = useQuery({
		queryKey: ["officer-recent-prices", user?.id],
		queryFn: async () => {
			if (!user) return [];
			const { data, error } = await supabase.from("prices").select("id, price_ghs, date_recorded, commodity:commodities(id,name,unit_of_measure), market:markets(id,name)").eq("recorded_by", user.id).order("created_at", { ascending: false }).limit(50);
			if (error) throw error;
			return data ?? [];
		},
		enabled: !!user
	});
	const updateMutation = useMutation({
		mutationFn: async (payload) => {
			return updatePrice(payload);
		},
		onSuccess: () => {
			toast.success("Price entry updated successfully!");
			setEditingPrice(null);
			queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
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
			return deletePrice({ id });
		},
		onSuccess: () => {
			toast.success("Price entry deleted.");
			setDeletingPrice(null);
			queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
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
			children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "Your Recent Price Entries"
			}), /* @__PURE__ */ jsx(CardDescription, { children: "A list of the last 50 prices you've recorded. You can edit or delete them here." })] }), /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })
			}) : error ? /* @__PURE__ */ jsx("p", {
				className: "text-center py-8 text-sm text-destructive",
				children: "Failed to load recent prices."
			}) : !entries?.length ? /* @__PURE__ */ jsx("p", {
				className: "text-center py-12 text-sm text-muted-foreground",
				children: "You haven't recorded any prices yet."
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
				"Are you sure you want to delete the recorded price of",
				" ",
				/* @__PURE__ */ jsxs("span", {
					className: "font-semibold text-foreground",
					children: ["₵", Number(deletingPrice?.price_ghs).toFixed(2)]
				}),
				" ",
				"for",
				" ",
				/* @__PURE__ */ jsx("span", {
					className: "font-semibold text-foreground",
					children: deletingPrice?.commodity?.name
				}),
				" ",
				"at",
				" ",
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
export { OfficerPage as component };
