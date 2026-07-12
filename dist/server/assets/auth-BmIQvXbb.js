import { n as useAuth, t as AUTH_TOKEN_KEY } from "./use-auth-5Qohn5zI.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, r as CardDescription, t as Card } from "./card-COiwJCYN.js";
import { t as Label } from "./label-D1P78ViY.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-D38Kr3Rg.js";
import { t as Input } from "./input-xp2aZ22i.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Sprout } from "lucide-react";
import { z } from "zod";
//#region src/routes/auth.tsx?tsr-split=component
var signInSchema = z.object({
	email: z.string().trim().email("Enter a valid email").max(255),
	password: z.string().min(6, "Password must be at least 6 characters").max(72)
});
var signUpSchema = signInSchema.extend({
	fullName: z.string().trim().min(2, "Enter your full name").max(100),
	phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
	region: z.string().trim().min(2, "Region required").max(100)
});
var GHANA_REGIONS = [
	"Greater Accra",
	"Ashanti",
	"Western",
	"Eastern",
	"Central",
	"Volta",
	"Northern",
	"Upper East",
	"Upper West",
	"Bono",
	"Bono East",
	"Ahafo",
	"Western North",
	"Oti",
	"Savannah",
	"North East"
];
function AuthPage() {
	const navigate = useNavigate();
	const { user, loading } = useAuth();
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (!loading && user) navigate({
			to: "/",
			replace: true
		});
	}, [
		user,
		loading,
		navigate
	]);
	async function handleSignIn(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const parsed = signInSchema.safeParse({
			email: fd.get("email"),
			password: fd.get("password")
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setBusy(true);
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(parsed.data)
			});
			const result = await response.json();
			setBusy(false);
			if (!response.ok) return toast.error(result.error || result.message || "Login failed");
			localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
			toast.success("Welcome back!");
			navigate({
				to: "/",
				replace: true
			});
		} catch (error) {
			setBusy(false);
			const message = error instanceof Error ? error.message : String(error);
			toast.error(message || "Login failed");
		}
	}
	async function handleSignUp(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const parsed = signUpSchema.safeParse({
			fullName: fd.get("fullName"),
			email: fd.get("email"),
			password: fd.get("password"),
			phone: fd.get("phone"),
			region: fd.get("region")
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setBusy(true);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: parsed.data.email,
					password: parsed.data.password,
					name: parsed.data.fullName,
					phone: parsed.data.phone,
					region: parsed.data.region,
					role: "farmer"
				})
			});
			const result = await response.json();
			setBusy(false);
			if (!response.ok) return toast.error(result.error || result.message || "Registration failed");
			localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
			toast.success("Account created. Welcome to AgriFarm!");
			navigate({
				to: "/",
				replace: true
			});
		} catch (error) {
			setBusy(false);
			const message = error instanceof Error ? error.message : String(error);
			toast.error(message || "Registration failed");
		}
	}
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("main", {
		className: "relative grid min-h-screen md:grid-cols-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative hidden flex-col justify-between overflow-hidden p-12 text-primary-foreground md:flex",
			style: {
				backgroundImage: `linear-gradient(135deg, oklch(0.35 0.1 145 / 0.85) 0%, oklch(0.45 0.13 150 / 0.9) 60%, oklch(0.55 0.15 90 / 0.9) 100%), url(/login-bg.jpg)`,
				backgroundSize: "cover",
				backgroundPosition: "center"
			},
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2 text-lg font-bold",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur",
						children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5" })
					}), "AgriFarm"]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("h1", {
						className: "font-display text-4xl font-bold leading-tight",
						children: [
							"Fair prices.",
							/* @__PURE__ */ jsx("br", {}),
							"Stronger farms."
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "max-w-md text-base text-white/85",
						children: "Real-time market prices from Makola, Kumasi, Kejetia, Techiman and Tamale — delivered to your phone, even without internet."
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-white/70",
					children: "Built for Ghanaian farmers · Powered by MoFA data officers"
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-center px-4 py-12 sm:px-8",
			children: /* @__PURE__ */ jsxs(Card, {
				className: "w-full max-w-md border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ jsxs(CardHeader, {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx(CardTitle, {
						className: "font-display text-2xl",
						children: "Welcome to AgriFarm"
					}), /* @__PURE__ */ jsx(CardDescription, { children: "Sign in or create an account to continue" })]
				}), /* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsxs(Tabs, {
					defaultValue: "signin",
					children: [
						/* @__PURE__ */ jsxs(TabsList, {
							className: "grid w-full grid-cols-2",
							children: [/* @__PURE__ */ jsx(TabsTrigger, {
								value: "signin",
								children: "Sign in"
							}), /* @__PURE__ */ jsx(TabsTrigger, {
								value: "signup",
								children: "Create account"
							})]
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "signin",
							children: /* @__PURE__ */ jsxs("form", {
								onSubmit: handleSignIn,
								className: "space-y-4 pt-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "si-email",
											children: "Email"
										}), /* @__PURE__ */ jsx(Input, {
											id: "si-email",
											name: "email",
											type: "email",
											autoComplete: "email",
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "si-password",
											children: "Password"
										}), /* @__PURE__ */ jsx(Input, {
											id: "si-password",
											name: "password",
											type: "password",
											autoComplete: "current-password",
											required: true
										})]
									}),
									/* @__PURE__ */ jsx(Button, {
										type: "submit",
										className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
										disabled: busy,
										children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Sign in"
									})
								]
							})
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "signup",
							children: /* @__PURE__ */ jsxs("form", {
								onSubmit: handleSignUp,
								className: "space-y-4 pt-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "su-name",
											children: "Full name"
										}), /* @__PURE__ */ jsx(Input, {
											id: "su-name",
											name: "fullName",
											required: true,
											maxLength: 100
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "su-email",
											children: "Email"
										}), /* @__PURE__ */ jsx(Input, {
											id: "su-email",
											name: "email",
											type: "email",
											autoComplete: "email",
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ jsx(Label, {
												htmlFor: "su-phone",
												children: "Phone"
											}), /* @__PURE__ */ jsx(Input, {
												id: "su-phone",
												name: "phone",
												type: "tel",
												placeholder: "+233 …",
												required: true
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ jsx(Label, {
												htmlFor: "su-region",
												children: "Region"
											}), /* @__PURE__ */ jsxs("select", {
												id: "su-region",
												name: "region",
												required: true,
												defaultValue: "",
												className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
												children: [/* @__PURE__ */ jsx("option", {
													value: "",
													disabled: true,
													children: "Select…"
												}), GHANA_REGIONS.map((r) => /* @__PURE__ */ jsx("option", {
													value: r,
													children: r
												}, r))]
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "su-password",
											children: "Password"
										}), /* @__PURE__ */ jsx(Input, {
											id: "su-password",
											name: "password",
											type: "password",
											autoComplete: "new-password",
											minLength: 6,
											required: true
										})]
									}),
									/* @__PURE__ */ jsx(Button, {
										type: "submit",
										className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
										disabled: busy,
										children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Create account"
									})
								]
							})
						})
					]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: "By continuing you agree to AgriFarm's terms of service."
				})] })]
			})
		})]
	}) });
}
//#endregion
export { AuthPage as component };
