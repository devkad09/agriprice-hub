import { i as createServerFn } from "./esm-9EjmF9OT.js";
import { t as requireSupabaseAuth } from "./auth-middleware-nRAWUjb7.js";
import { t as supabase } from "./client-BmsDyj3x.js";
import { t as createSsrRpc } from "./createSsrRpc-6TodB_Q1.js";
import { a as CardTitle, c as cn, i as CardHeader, l as useAuth, n as CardContent, o as Button, r as CardDescription, t as Card } from "./card-De5G926P.js";
import { t as SiteHeader } from "./site-header-dDAbAvco.js";
import { t as Label } from "./label-Bvr4b2Cj.js";
import { t as Input } from "./input-a7DTiqQY.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DaoE4-sx.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Loader2, Smartphone, Trash2 } from "lucide-react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
//#region src/components/ui/switch.tsx
var Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SwitchPrimitives.Root, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ jsx(SwitchPrimitives.Thumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = SwitchPrimitives.Root.displayName;
//#endregion
//#region src/lib/subscriptions.functions.ts
var listSubscriptions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e24333c6272feb27d0ee4789f0270818e43d936a3c3c10b227d97f693ab057d2"));
var createSchema = z.object({
	commodityId: z.string().uuid(),
	frequency: z.enum(["daily", "weekly"]).default("daily")
});
var createSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => createSchema.parse(input)).handler(createSsrRpc("4fbc6da2ab4aa04a6a8a2c34de712dc592acee5d52f091572a8bed8cbce81b9b"));
var toggleSchema = z.object({
	id: z.string().uuid(),
	active: z.boolean()
});
var toggleSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => toggleSchema.parse(input)).handler(createSsrRpc("033667c913ae56469aafaeabfe0bb307b255c02bdc29f23d0a370ba6275ee32b"));
var deleteSchema = z.object({ id: z.string().uuid() });
var deleteSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => deleteSchema.parse(input)).handler(createSsrRpc("d652fc387ba51bccc0f3320556f7f74bca720169f0d68460150cbf4483faf479"));
//#endregion
//#region src/routes/subscriptions.tsx?tsr-split=component
function SubscriptionsPage() {
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
	if (authLoading) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!user) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-5xl px-4 py-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-bold",
					children: "SMS Price Alerts"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-muted-foreground",
					children: "Get instant crop prices delivered to your phone. Never miss market trends."
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 md:grid-cols-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-8 md:col-span-1",
					children: [/* @__PURE__ */ jsx(PhoneVerificationSection, {}), /* @__PURE__ */ jsx(AddSubscriptionForm, {})]
				}), /* @__PURE__ */ jsx("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ jsx(SubscriptionsList, {})
				})]
			})]
		})]
	});
}
function PhoneVerificationSection() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [phone, setPhone] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const { data: profile, isLoading } = useQuery({
		queryKey: ["profile-phone", user?.id],
		queryFn: async () => {
			if (!user) return null;
			const { data, error } = await supabase.from("profiles").select("phone").eq("id", user.id).single();
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	useEffect(() => {
		if (profile?.phone) setPhone(profile.phone);
	}, [profile]);
	const updatePhoneMutation = useMutation({
		mutationFn: async (newPhone) => {
			const { error } = await supabase.from("profiles").update({ phone: newPhone }).eq("id", user.id);
			if (error) throw error;
			return newPhone;
		},
		onSuccess: () => {
			toast.success("Phone number updated successfully!");
			setIsEditing(false);
			queryClient.invalidateQueries({ queryKey: ["profile-phone", user?.id] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to update phone number");
		}
	});
	const handleSave = (e) => {
		e.preventDefault();
		if (!phone.trim()) {
			toast.error("Phone number cannot be empty.");
			return;
		}
		updatePhoneMutation.mutate(phone.trim());
	};
	if (isLoading) return /* @__PURE__ */ jsx(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ jsx(CardContent, {
			className: "py-6 flex justify-center",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		})
	});
	const hasPhone = !!profile?.phone;
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "pb-3",
			children: [/* @__PURE__ */ jsxs(CardTitle, {
				className: "font-display text-base flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Smartphone, { className: "h-4.5 w-4.5 text-primary" }), "Alerts Phone Number"]
			}), /* @__PURE__ */ jsx(CardDescription, { children: "All SMS updates will be sent here." })]
		}), /* @__PURE__ */ jsx(CardContent, { children: isEditing ? /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSave,
			className: "space-y-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "phone-input",
					children: "Phone Number"
				}), /* @__PURE__ */ jsx(Input, {
					id: "phone-input",
					type: "tel",
					placeholder: "e.g. +233241234567",
					value: phone,
					onChange: (e) => setPhone(e.target.value),
					required: true
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsx(Button, {
					type: "submit",
					size: "sm",
					className: "flex-1",
					disabled: updatePhoneMutation.isPending,
					children: updatePhoneMutation.isPending ? "Saving..." : "Save"
				}), /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => {
						setPhone(profile?.phone || "");
						setIsEditing(false);
					},
					children: "Cancel"
				})]
			})]
		}) : /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg bg-muted/40 p-3 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground uppercase font-semibold",
						children: "Active Number"
					}), /* @__PURE__ */ jsx("p", {
						className: "font-display font-medium text-sm mt-0.5",
						children: hasPhone ? profile.phone : "No phone number set"
					})] }), hasPhone && /* @__PURE__ */ jsx(Check, { className: "h-5 w-5 text-emerald-500" })]
				}),
				!hasPhone && /* @__PURE__ */ jsx("p", {
					className: "text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5 border border-amber-200",
					children: "You must verify and save your phone number before you can receive SMS alerts."
				}),
				/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					size: "sm",
					className: "w-full",
					onClick: () => setIsEditing(true),
					children: hasPhone ? "Change Phone Number" : "Set Phone Number"
				})
			]
		}) })]
	});
}
function AddSubscriptionForm() {
	const queryClient = useQueryClient();
	const [commodityId, setCommodityId] = useState("");
	const [frequency, setFrequency] = useState("daily");
	const { data: commodities } = useQuery({
		queryKey: ["commodities-for-subs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("commodities").select("id, name, category").order("name");
			if (error) throw error;
			return data;
		}
	});
	useEffect(() => {
		if (commodities?.length && !commodityId) setCommodityId(commodities[0].id);
	}, [commodities, commodityId]);
	const addMutation = useMutation({
		mutationFn: async (payload) => {
			return createSubscription(payload);
		},
		onSuccess: () => {
			toast.success("Subscribed to price alerts!");
			queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
			queryClient.invalidateQueries({ queryKey: ["stats-subs"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			if (message.includes("unique")) toast.error("You are already subscribed to this commodity!");
			else toast.error(message || "Failed to subscribe");
		}
	});
	const handleSubscribe = (e) => {
		e.preventDefault();
		if (!commodityId) return;
		addMutation.mutate({
			commodityId,
			frequency
		});
	};
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "pb-3",
			children: [/* @__PURE__ */ jsxs(CardTitle, {
				className: "font-display text-base flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Bell, { className: "h-4.5 w-4.5 text-primary" }), "Add Crop Alert"]
			}), /* @__PURE__ */ jsx(CardDescription, { children: "Subscribe to alerts for a new crop." })]
		}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubscribe,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "sub-commodity",
						children: "Crop / Commodity"
					}), /* @__PURE__ */ jsx("select", {
						id: "sub-commodity",
						value: commodityId,
						onChange: (e) => setCommodityId(e.target.value),
						className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
						children: commodities?.map((c) => /* @__PURE__ */ jsxs("option", {
							value: c.id,
							children: [
								c.name,
								" (",
								c.category,
								")"
							]
						}, c.id))
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "sub-frequency",
						children: "Alert Frequency"
					}), /* @__PURE__ */ jsxs("select", {
						id: "sub-frequency",
						value: frequency,
						onChange: (e) => setFrequency(e.target.value),
						className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
						children: [/* @__PURE__ */ jsx("option", {
							value: "daily",
							children: "Daily price update"
						}), /* @__PURE__ */ jsx("option", {
							value: "weekly",
							children: "Weekly price digest"
						})]
					})]
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					className: "w-full",
					disabled: addMutation.isPending,
					children: addMutation.isPending ? "Subscribing..." : "Subscribe Now"
				})
			]
		}) })]
	});
}
function SubscriptionsList() {
	const queryClient = useQueryClient();
	const [deletingSub, setDeletingSub] = useState(null);
	const { data: subs, isLoading, error } = useQuery({
		queryKey: ["user-subscriptions"],
		queryFn: async () => {
			return (await listSubscriptions()).subscriptions ?? [];
		}
	});
	const toggleMutation = useMutation({
		mutationFn: async (payload) => {
			return toggleSubscription(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
			queryClient.invalidateQueries({ queryKey: ["stats-subs"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to update subscription status");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			return deleteSubscription({ id });
		},
		onSuccess: () => {
			toast.success("Subscription removed.");
			setDeletingSub(null);
			queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
			queryClient.invalidateQueries({ queryKey: ["stats-subs"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to remove subscription");
		}
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
			className: "font-display text-lg",
			children: "Your Subscriptions"
		}), /* @__PURE__ */ jsx(CardDescription, { children: "Turn alerts on or off, or unsubscribe from commodities." })] }), /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })
		}) : error ? /* @__PURE__ */ jsx("p", {
			className: "text-center py-8 text-sm text-destructive",
			children: "Failed to load subscriptions."
		}) : !subs?.length ? /* @__PURE__ */ jsxs("div", {
			className: "text-center py-12",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground mb-4",
				children: "You have no active SMS alerts."
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground/80 max-w-sm mx-auto",
				children: "Subscribe to crop updates using the form on the left to receive regular price updates straight to your phone."
			})]
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: subs.map((sub) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between rounded-lg border border-border/55 p-4 hover:border-border transition-all",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "font-display font-semibold text-base",
						children: sub.commodity?.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: [
							"Category: ",
							sub.commodity?.category,
							" · Unit: ",
							sub.commodity?.unit_of_measure
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-2xs font-semibold text-primary capitalize",
						children: [sub.frequency, " updates"]
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: sub.active ? "Active" : "Paused"
						}), /* @__PURE__ */ jsx(Switch, {
							checked: sub.active,
							onCheckedChange: (checked) => toggleMutation.mutate({
								id: sub.id,
								active: checked
							})
						})]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "icon",
						className: "text-muted-foreground hover:text-destructive hover:bg-destructive/5",
						onClick: () => setDeletingSub(sub),
						children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4.5 w-4.5" }), /* @__PURE__ */ jsx("span", {
							className: "sr-only",
							children: "Delete"
						})]
					})]
				})]
			}, sub.id))
		}) })]
	}), /* @__PURE__ */ jsx(AlertDialog, {
		open: deletingSub !== null,
		onOpenChange: (open) => !open && setDeletingSub(null),
		children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Unsubscribe from Alerts?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
			"Are you sure you want to stop receiving SMS price updates for",
			" ",
			/* @__PURE__ */ jsx("span", {
				className: "font-semibold text-foreground",
				children: deletingSub?.commodity?.name
			}),
			"? You can subscribe again at any time."
		] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
			onClick: () => deletingSub && deleteMutation.mutate(deletingSub.id),
			className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			disabled: deleteMutation.isPending,
			children: deleteMutation.isPending ? "Unsubscribing..." : "Unsubscribe"
		})] })] })
	})] });
}
//#endregion
export { SubscriptionsPage as component };
