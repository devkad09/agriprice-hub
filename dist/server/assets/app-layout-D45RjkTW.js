import { n as useAuth } from "./use-auth-5Qohn5zI.js";
import { c as cn, o as Button } from "./card-COiwJCYN.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronRight, Circle, LogOut, Menu, Sprout, User, X } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
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
		setRoles(user.role ? [user.role] : []);
		setLoading(false);
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
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
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
		localStorage.removeItem("AGRIFARM_AUTH_TOKEN");
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
						user && canEditPrices && /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsxs("button", {
								className: "inline-flex items-center gap-2 text-primary hover:text-primary/95 transition-colors font-medium",
								"aria-expanded": false,
								children: ["Officer Panel", /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })]
							})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "start",
							children: [
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Link, {
										to: "/officer",
										children: "Overview"
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Link, {
										to: "/officer/add-price",
										children: "Add Price"
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Link, {
										to: "/officer/manage-prices",
										children: "Manage Prices"
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Link, {
										to: "/dashboard",
										children: "Dashboard"
									})
								})
							]
						})] })
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
					user && canEditPrices && /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/officer",
							onClick: () => setMobileMenuOpen(false),
							className: "py-1 text-primary hover:text-primary/95 font-medium",
							activeProps: { className: "font-semibold" },
							children: "Officer Panel"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/officer/add-price",
							onClick: () => setMobileMenuOpen(false),
							className: "pl-4 py-1 text-muted-foreground hover:text-foreground text-sm",
							children: "Add Price"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/officer/manage-prices",
							onClick: () => setMobileMenuOpen(false),
							className: "pl-4 py-1 text-muted-foreground hover:text-foreground text-sm",
							children: "Manage Prices"
						})
					] }),
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
//#region src/components/app-layout.tsx
function AppLayout({ children, className, fullWidth = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(SiteHeader, {}), /* @__PURE__ */ jsx("div", {
			className: cn(fullWidth ? "w-full" : "mx-auto max-w-6xl px-4 py-8", className),
			children
		})]
	});
}
//#endregion
export { useRole as n, AppLayout as t };
