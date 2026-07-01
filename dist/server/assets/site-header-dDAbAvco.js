import { t as supabase } from "./client-BmsDyj3x.js";
import { l as useAuth, o as Button } from "./card-De5G926P.js";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Menu, Sprout, User, X } from "lucide-react";
//#region src/lib/use-role.ts
function useRole() {
	const { user, loading: authLoading } = useAuth();
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (authLoading) return;
		if (!user) {
			setRoles([]);
			setLoading(false);
			return;
		}
		supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
			setRoles((data ?? []).map((r) => r.role));
			setLoading(false);
		});
	}, [user, authLoading]);
	return {
		roles,
		loading: authLoading || loading,
		isAdmin: roles.includes("admin"),
		isOfficer: roles.includes("data_officer"),
		isFarmer: roles.includes("farmer"),
		canEditPrices: roles.includes("data_officer") || roles.includes("admin")
	};
}
//#endregion
//#region src/components/site-header.tsx
function SiteHeader() {
	const { user, loading } = useAuth();
	const { canEditPrices } = useRole();
	const queryClient = useQueryClient();
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	async function signOut() {
		setMobileMenuOpen(false);
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		router.navigate({
			to: "/auth",
			replace: true
		});
	}
	const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					onClick: () => setMobileMenuOpen(false),
					className: "flex items-center gap-2 font-display text-lg font-bold tracking-tight",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm",
						children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5" })
					}), /* @__PURE__ */ jsx("span", { children: "AgriFarm" })]
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "hover:text-foreground transition-colors",
							activeProps: { className: "text-foreground font-semibold" },
							children: "Home"
						}),
						user && /* @__PURE__ */ jsx(Link, {
							to: "/dashboard",
							className: "hover:text-foreground transition-colors",
							activeProps: { className: "text-foreground font-semibold" },
							children: "Dashboard"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/prices",
							className: "hover:text-foreground transition-colors",
							activeProps: { className: "text-foreground font-semibold" },
							children: "Prices"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/search",
							className: "hover:text-foreground transition-colors",
							activeProps: { className: "text-foreground font-semibold" },
							children: "Search"
						}),
						user && /* @__PURE__ */ jsx(Link, {
							to: "/subscriptions",
							className: "hover:text-foreground transition-colors",
							activeProps: { className: "text-foreground font-semibold" },
							children: "Alerts"
						}),
						user && canEditPrices && /* @__PURE__ */ jsx(Link, {
							to: "/officer",
							className: "text-primary hover:text-primary/95 transition-colors font-medium",
							activeProps: { className: "font-semibold underline underline-offset-4" },
							children: "Officer Panel"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "hidden items-center gap-2 md:flex",
						children: loading ? null : user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-full border border-border/50",
							children: [/* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ jsx("span", {
								className: "max-w-[120px] truncate",
								children: user.email
							})]
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							onClick: signOut,
							children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Sign out" })]
						})] }) : /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							className: "bg-primary text-primary-foreground hover:bg-primary/90",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/auth",
								children: "Sign in"
							})
						})
					}), /* @__PURE__ */ jsx("button", {
						onClick: toggleMobileMenu,
						className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground md:hidden",
						"aria-label": "Toggle navigation menu",
						children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
					})]
				})
			]
		}), mobileMenuOpen && /* @__PURE__ */ jsx("div", {
			className: "border-b border-border bg-background px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top duration-200",
			children: /* @__PURE__ */ jsxs("nav", {
				className: "flex flex-col gap-4 text-sm font-medium",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						onClick: () => setMobileMenuOpen(false),
						className: "py-1 text-muted-foreground hover:text-foreground",
						activeProps: { className: "text-foreground font-semibold" },
						children: "Home"
					}),
					user && /* @__PURE__ */ jsx(Link, {
						to: "/dashboard",
						onClick: () => setMobileMenuOpen(false),
						className: "py-1 text-muted-foreground hover:text-foreground",
						activeProps: { className: "text-foreground font-semibold" },
						children: "Dashboard"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/prices",
						onClick: () => setMobileMenuOpen(false),
						className: "py-1 text-muted-foreground hover:text-foreground",
						activeProps: { className: "text-foreground font-semibold" },
						children: "Prices"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/search",
						onClick: () => setMobileMenuOpen(false),
						className: "py-1 text-muted-foreground hover:text-foreground",
						activeProps: { className: "text-foreground font-semibold" },
						children: "Search"
					}),
					user && /* @__PURE__ */ jsx(Link, {
						to: "/subscriptions",
						onClick: () => setMobileMenuOpen(false),
						className: "py-1 text-muted-foreground hover:text-foreground",
						activeProps: { className: "text-foreground font-semibold" },
						children: "Alerts"
					}),
					user && canEditPrices && /* @__PURE__ */ jsx(Link, {
						to: "/officer",
						onClick: () => setMobileMenuOpen(false),
						className: "py-1 text-primary hover:text-primary/95 font-medium",
						activeProps: { className: "font-semibold" },
						children: "Officer Panel"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "border-t border-border pt-4 mt-2",
						children: loading ? null : user ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: user.email
								})]
							}), /* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								size: "sm",
								onClick: signOut,
								className: "w-full justify-start",
								children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"]
							})]
						}) : /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
							onClick: () => setMobileMenuOpen(false),
							children: /* @__PURE__ */ jsx(Link, {
								to: "/auth",
								children: "Sign in"
							})
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { useRole as n, SiteHeader as t };
