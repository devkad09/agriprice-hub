import { t as supabase } from "./client-BmsDyj3x.js";
import { a as CardTitle, i as CardHeader, l as useAuth, n as CardContent, o as Button, r as CardDescription, t as Card } from "./card-De5G926P.js";
import { t as Label } from "./label-Bvr4b2Cj.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CBhcaFmx.js";
import { t as Input } from "./input-a7DTiqQY.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Dl8KLpSk.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, ExternalLink, Loader2, Shield, Sparkles, Sprout, User } from "lucide-react";
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
	const [mockOpen, setMockOpen] = useState(false);
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
		const { error } = await supabase.auth.signInWithPassword(parsed.data);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Welcome back!");
		navigate({
			to: "/",
			replace: true
		});
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
		const { error } = await supabase.auth.signUp({
			email: parsed.data.email,
			password: parsed.data.password,
			options: {
				emailRedirectTo: window.location.origin,
				data: {
					full_name: parsed.data.fullName,
					phone: parsed.data.phone,
					region: parsed.data.region
				}
			}
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Account created. Welcome to AgriFarm!");
		navigate({
			to: "/",
			replace: true
		});
	}
	async function handleGoogle() {
		setBusy(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (error) {
			setBusy(false);
			toast.error("Google sign-in failed: " + error.message);
		}
	}
	async function handleRealGoogle() {
		setBusy(true);
		setMockOpen(false);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (error) {
			setBusy(false);
			toast.error("Google sign-in failed: " + error.message);
		}
	}
	async function handleMockSignIn(email, name, role) {
		setBusy(true);
		const password = "mock-google-password-123";
		const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (signInError) {
			const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: { data: {
					full_name: name,
					role,
					phone: "+233240000000",
					region: "Greater Accra"
				} }
			});
			if (signUpError) {
				setBusy(false);
				toast.error("Mock sign-in failed: " + signUpError.message);
				return;
			}
			if (signUpData.session) {
				setBusy(false);
				toast.success(`Welcome to AgriFarm, ${name}!`);
				setMockOpen(false);
				navigate({
					to: "/",
					replace: true
				});
				return;
			}
			setBusy(false);
			toast.success("Mock user registered successfully!");
			return;
		}
		setBusy(false);
		toast.success(`Welcome back, ${name}!`);
		setMockOpen(false);
		navigate({
			to: "/",
			replace: true
		});
	}
	async function handleCustomMockSubmit(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const email = fd.get("mock-email");
		const name = fd.get("mock-name");
		const role = fd.get("mock-role");
		if (!email || !name || !role) {
			toast.error("Please fill in all fields.");
			return;
		}
		await handleMockSignIn(email.trim(), name.trim(), role);
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("main", {
		className: "relative grid min-h-screen md:grid-cols-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative hidden flex-col justify-between overflow-hidden p-12 text-primary-foreground md:flex",
			style: { background: "var(--gradient-hero)" },
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
				}), /* @__PURE__ */ jsxs(CardContent, { children: [
					/* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: handleGoogle,
						disabled: busy,
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "h-4 w-4",
							viewBox: "0 0 24 24",
							children: [
								/* @__PURE__ */ jsx("path", {
									fill: "#4285F4",
									d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								}),
								/* @__PURE__ */ jsx("path", {
									fill: "#34A853",
									d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								}),
								/* @__PURE__ */ jsx("path", {
									fill: "#FBBC05",
									d: "M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"
								}),
								/* @__PURE__ */ jsx("path", {
									fill: "#EA4335",
									d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
								})
							]
						}), "Continue with Google"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative my-6 text-center text-xs uppercase tracking-wider text-muted-foreground",
						children: [/* @__PURE__ */ jsx("span", {
							className: "bg-card px-3 relative z-10",
							children: "or"
						}), /* @__PURE__ */ jsx("span", { className: "absolute inset-x-0 top-1/2 -z-0 h-px bg-border" })]
					}),
					/* @__PURE__ */ jsxs(Tabs, {
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
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: "By continuing you agree to AgriFarm's terms of service."
					})
				] })]
			})
		})]
	}), /* @__PURE__ */ jsx(Dialog, {
		open: mockOpen,
		onOpenChange: setMockOpen,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-6 rounded-xl animate-in fade-in-50 duration-200",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, {
					className: "space-y-2 pb-4 border-b border-border/50",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-primary font-bold",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-amber-500 animate-pulse" }), /* @__PURE__ */ jsx("span", {
								className: "bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent",
								children: "Local Dev Sandbox"
							})]
						}),
						/* @__PURE__ */ jsx(DialogTitle, {
							className: "font-display text-2xl font-bold tracking-tight",
							children: "Google Sign-In Simulator"
						}),
						/* @__PURE__ */ jsx(DialogDescription, {
							className: "text-sm text-muted-foreground",
							children: "Since Google OAuth credentials are not configured on this Supabase backend, you can use this local sandbox to sign in with specific test roles."
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-4 pt-4",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground/80",
						children: "Select a Quick-Start Profile"
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleMockSignIn("farmer@agrifarm.dev", "Abebe Mensah", "farmer"),
								disabled: busy,
								className: "group relative flex flex-col justify-between text-left p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between w-full",
									children: [/* @__PURE__ */ jsx("span", {
										className: "p-2 bg-emerald-500/10 rounded-lg text-emerald-600 group-hover:bg-emerald-500/20 transition-colors",
										children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700",
										children: "Farmer"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-foreground text-sm group-hover:text-emerald-700 transition-colors",
										children: "Abebe Mensah"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground mt-1 line-clamp-2",
										children: "View market prices & configure SMS subscriptions."
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleMockSignIn("officer@agrifarm.dev", "Ama Osei", "data_officer"),
								disabled: busy,
								className: "group relative flex flex-col justify-between text-left p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between w-full",
									children: [/* @__PURE__ */ jsx("span", {
										className: "p-2 bg-blue-500/10 rounded-lg text-blue-600 group-hover:bg-blue-500/20 transition-colors",
										children: /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-700",
										children: "Officer"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-foreground text-sm group-hover:text-blue-700 transition-colors",
										children: "Ama Osei"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground mt-1 line-clamp-2",
										children: "Record daily commodity prices across hubs."
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleMockSignIn("admin@agrifarm.dev", "Kofi Boateng", "admin"),
								disabled: busy,
								className: "group relative flex flex-col justify-between text-left p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between w-full",
									children: [/* @__PURE__ */ jsx("span", {
										className: "p-2 bg-purple-500/10 rounded-lg text-purple-600 group-hover:bg-purple-500/20 transition-colors",
										children: /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-700",
										children: "Admin"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-foreground text-sm group-hover:text-purple-700 transition-colors",
										children: "Kofi Boateng"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground mt-1 line-clamp-2",
										children: "Access audit logs, manage markets and configurations."
									})]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative my-6 text-center text-xs uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ jsx("span", {
						className: "bg-background px-3 relative z-10",
						children: "Or custom developer profile"
					}), /* @__PURE__ */ jsx("span", { className: "absolute inset-x-0 top-1/2 -z-0 h-px bg-border" })]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleCustomMockSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "mock-name",
									children: "Full name"
								}), /* @__PURE__ */ jsx(Input, {
									id: "mock-name",
									name: "mock-name",
									placeholder: "e.g. Yao Mensah",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "mock-email",
									children: "Email address"
								}), /* @__PURE__ */ jsx(Input, {
									id: "mock-email",
									name: "mock-email",
									type: "email",
									placeholder: "e.g. yao@gmail.com",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx(Label, {
									htmlFor: "mock-role",
									children: "Simulated User Role"
								}),
								/* @__PURE__ */ jsxs("select", {
									id: "mock-role",
									name: "mock-role",
									required: true,
									defaultValue: "farmer",
									className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "farmer",
											children: "Farmer (Default)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "data_officer",
											children: "Data Officer"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "admin",
											children: "Admin"
										})
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Note: Specifying custom roles requires the updated handle_new_user trigger in Supabase."
								})
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							className: "w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-700 hover:to-teal-600 transition-all cursor-pointer",
							disabled: busy,
							children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mx-auto" }) : "Sign In & Register Sandbox User"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pt-4 mt-2 border-t border-border/50 text-center",
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: handleRealGoogle,
						className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
						children: ["Trigger Real Google OAuth Redirect ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })]
					})
				})
			]
		})
	})] });
}
//#endregion
export { AuthPage as component };
