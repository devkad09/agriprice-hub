import { n as useAuth } from "./use-auth-5Qohn5zI.js";
import { n as useRole, t as AppLayout } from "./app-layout-D45RjkTW.js";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Button, r as CardDescription, t as Card } from "./card-COiwJCYN.js";
import { t as Label } from "./label-D1P78ViY.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-D38Kr3Rg.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle, FileSpreadsheet, History, Loader2, RefreshCw, Send, ShieldAlert, Upload, Users } from "lucide-react";
//#region src/routes/admin.tsx?tsr-split=component
function AdminPage() {
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	const { roles, loading: roleLoading, isAdmin } = useRole();
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
	useEffect(() => {
		if (!authLoading && !roleLoading && user && !isAdmin) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [
		user,
		authLoading,
		roleLoading,
		isAdmin,
		navigate
	]);
	if (authLoading || roleLoading) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center bg-background",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!user || !isAdmin) return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx("main", {
		className: "mx-auto max-w-xl px-4 py-20 text-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-destructive/20 bg-destructive/5 p-8 shadow-sm",
			children: [
				/* @__PURE__ */ jsx(ShieldAlert, { className: "mx-auto h-12 w-12 text-destructive" }),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 font-display text-2xl font-bold",
					children: "Access Denied"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-muted-foreground",
					children: "Only authorized Administrators can access this console."
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
	}) });
	return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-8 flex items-center justify-between",
			children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent",
				children: "Admin Control Console"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-muted-foreground",
				children: "Manage farmer roles, inspect audit records, import CSV prices, and trigger alerts."
			})] })
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "users",
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs(TabsList, {
					className: "grid w-full grid-cols-2 max-w-md sm:grid-cols-4 bg-muted/65 p-1 rounded-xl",
					children: [
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "users",
							className: "flex items-center gap-1.5 rounded-lg py-2",
							children: [/* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }), " Users"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "audit",
							className: "flex items-center gap-1.5 rounded-lg py-2",
							children: [/* @__PURE__ */ jsx(History, { className: "h-4 w-4" }), " Audit Logs"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "import",
							className: "flex items-center gap-1.5 rounded-lg py-2",
							children: [/* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-4 w-4" }), " Import CSV"]
						}),
						/* @__PURE__ */ jsxs(TabsTrigger, {
							value: "sms",
							className: "flex items-center gap-1.5 rounded-lg py-2",
							children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), " SMS Broadcast"]
						})
					]
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "users",
					children: /* @__PURE__ */ jsx(UserManagementTab, {})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "audit",
					children: /* @__PURE__ */ jsx(AuditLogsTab, {})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "import",
					children: /* @__PURE__ */ jsx(BulkImportTab, {})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "sms",
					children: /* @__PURE__ */ jsx(SmsBroadcastTab, {})
				})
			]
		})]
	}) });
}
function UserManagementTab() {
	const queryClient = useQueryClient();
	const { data: userData, isLoading, error, refetch } = useQuery({
		queryKey: ["admin-users-list"],
		queryFn: async () => {
			const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
			const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
			if (!res.ok) throw new Error("Failed to fetch users");
			return res.json();
		}
	});
	const changeRoleMutation = useMutation({
		mutationFn: async (payload) => {
			const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
			const res = await fetch("/api/admin/update-role", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					userId: payload.targetUserId,
					role: payload.role
				})
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.message || err.error || "Failed to update role");
			}
			return res.json();
		},
		onSuccess: () => {
			toast.success("User role updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to update role");
		}
	});
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "flex justify-center py-16",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-8 text-destructive",
		children: [
			/* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 mx-auto" }),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm",
				children: "Failed to load user profiles."
			}),
			/* @__PURE__ */ jsx(Button, {
				onClick: () => refetch(),
				size: "sm",
				variant: "outline",
				className: "mt-4",
				children: "Try Again"
			})
		]
	});
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row items-center justify-between border-b pb-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "System User Profiles"
			}), /* @__PURE__ */ jsx(CardDescription, { children: "View all accounts and change user roles." })] }), /* @__PURE__ */ jsx(Button, {
				size: "icon",
				variant: "outline",
				onClick: () => refetch(),
				className: "h-8 w-8",
				children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ jsx(CardContent, {
			className: "pt-6",
			children: /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Full Name"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Phone"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Region"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Joined Date"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 text-right font-medium",
								children: "Access Role"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: (userData ?? []).map((u) => {
						const primaryRole = u.roles.includes("admin") ? "admin" : u.roles.includes("data_officer") ? "data_officer" : "farmer";
						return /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 pr-4 font-semibold text-foreground",
									children: u.full_name || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 pr-4 text-muted-foreground",
									children: u.phone || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 pr-4 text-muted-foreground",
									children: u.region || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 pr-4 text-muted-foreground whitespace-nowrap",
									children: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 text-right",
									children: /* @__PURE__ */ jsxs("select", {
										value: primaryRole,
										onChange: (e) => changeRoleMutation.mutate({
											targetUserId: u.id,
											role: e.target.value
										}),
										disabled: changeRoleMutation.isPending,
										className: "h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring font-medium",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "farmer",
												children: "Farmer"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "data_officer",
												children: "Data Officer"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "admin",
												children: "Administrator"
											})
										]
									})
								})
							]
						}, u.id);
					}) })]
				})
			})
		})]
	});
}
function AuditLogsTab() {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["admin-audit-logs"],
		queryFn: async () => {
			const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
			const res = await fetch("/api/admin/audit-log", { headers: { Authorization: `Bearer ${token}` } });
			if (!res.ok) throw new Error("Failed to fetch audit logs");
			return res.json();
		}
	});
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "flex justify-center py-16",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-8 text-destructive",
		children: [
			/* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 mx-auto" }),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm",
				children: "Failed to load audit logs."
			}),
			/* @__PURE__ */ jsx(Button, {
				onClick: () => refetch(),
				size: "sm",
				variant: "outline",
				className: "mt-4",
				children: "Try Again"
			})
		]
	});
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row items-center justify-between border-b pb-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "System Audit Trail"
			}), /* @__PURE__ */ jsx(CardDescription, { children: "Logs of the last 100 modifications, creations, and updates." })] }), /* @__PURE__ */ jsx(Button, {
				size: "icon",
				variant: "outline",
				onClick: () => refetch(),
				className: "h-8 w-8",
				children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ jsx(CardContent, {
			className: "pt-6",
			children: /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b text-left uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Timestamp"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "User"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Action"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Table"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 pr-4 font-medium",
								children: "Record ID"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-3 font-medium",
								children: "Details"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: (data ?? []).map((l) => {
						let badgeColor = "bg-muted text-muted-foreground border-muted-foreground/20";
						if (l.action === "create") badgeColor = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
						else if (l.action === "update") badgeColor = "bg-blue-500/10 text-blue-700 border-blue-500/20";
						else if (l.action === "delete") badgeColor = "bg-destructive/10 text-destructive border-destructive/20";
						else if (l.action === "update_role") badgeColor = "bg-purple-500/10 text-purple-700 border-purple-500/20";
						return /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-2.5 pr-4 text-muted-foreground whitespace-nowrap",
									children: l.created_at ? new Date(l.created_at).toLocaleString() : "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2.5 pr-4 font-medium text-foreground whitespace-nowrap",
									children: l.user_name || "System"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2.5 pr-4",
									children: /* @__PURE__ */ jsx("span", {
										className: `inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold capitalize ${badgeColor}`,
										children: l.action
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2.5 pr-4 text-muted-foreground font-mono",
									children: l.table_name
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2.5 pr-4 text-muted-foreground font-mono whitespace-nowrap truncate max-w-[120px]",
									title: l.record_id ?? "",
									children: l.record_id || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2.5 text-muted-foreground max-w-sm truncate",
									title: JSON.stringify(l.details),
									children: l.details ? JSON.stringify(l.details) : "—"
								})
							]
						}, l.id);
					}) })]
				})
			})
		})]
	});
}
function BulkImportTab() {
	const queryClient = useQueryClient();
	const [selectedFile, setSelectedFile] = useState(null);
	const [parsedRows, setParsedRows] = useState([]);
	const [importResult, setImportResult] = useState(null);
	const importMutation = useMutation({
		mutationFn: async () => {
			if (!selectedFile) throw new Error("No file selected");
			const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
			const formData = new FormData();
			formData.append("file", selectedFile);
			const res = await fetch("/api/admin/bulk-import", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.message || err.error || "Failed to process bulk import.");
			}
			return res.json();
		},
		onSuccess: (res) => {
			setImportResult(res);
			toast.success(res.message || `Successfully imported price records!`);
			setParsedRows([]);
			setSelectedFile(null);
			queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
		},
		onError: (err) => {
			const message = err instanceof Error ? err.message : String(err);
			toast.error(message || "Failed to process bulk import.");
		}
	});
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelectedFile(file);
		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result;
			parseCSV(text);
		};
		reader.readAsText(file);
	};
	const parseCSV = (text) => {
		try {
			const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
			if (lines.length < 2) {
				toast.error("CSV file must contain a header and at least one data row.");
				return;
			}
			const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
			const rows = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
				const rowObj = {};
				headers.forEach((header, idx) => {
					rowObj[header] = values[idx];
				});
				rows.push(rowObj);
			}
			const formatted = rows.map((r, idx) => {
				const marketId = r.market_id || r.marketId;
				const commodityId = r.commodity_id || r.commodityId;
				const priceVal = parseFloat(r.price_ghc || r.price_ghs || r.price);
				const dateVal = r.date_recorded || r.dateRecorded || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
				return {
					rowNumber: idx + 2,
					marketId,
					commodityId,
					priceGhs: priceVal,
					dateRecorded: dateVal,
					isValid: !!marketId && !!commodityId && !isNaN(priceVal) && priceVal > 0
				};
			});
			setParsedRows(formatted);
			setImportResult(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			toast.error("Failed to parse CSV: " + message);
		}
	};
	const handleImportSubmit = () => {
		if (!selectedFile) {
			toast.error("No file selected.");
			return;
		}
		importMutation.mutate();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 md:grid-cols-3",
		children: [/* @__PURE__ */ jsxs(Card, {
			className: "md:col-span-1 border-border/60 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "Upload Price Data"
			}), /* @__PURE__ */ jsxs(CardDescription, { children: ["Select a CSV file to load crop prices. Columns must include:", /* @__PURE__ */ jsx("code", {
				className: "block mt-1 bg-muted p-1.5 rounded text-2xs font-mono",
				children: "market_id, commodity_id, price_ghc, date_recorded"
			})] })] }), /* @__PURE__ */ jsxs(CardContent, {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid w-full items-center gap-1.5",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "csv-file",
						children: "CSV Data File"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/20 border-border hover:bg-muted/40 transition-colors relative cursor-pointer group",
						children: [/* @__PURE__ */ jsx("input", {
							id: "csv-file",
							type: "file",
							accept: ".csv",
							onChange: handleFileChange,
							className: "absolute inset-0 opacity-0 cursor-pointer"
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-center",
							children: [/* @__PURE__ */ jsx(Upload, { className: "h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" }), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs text-muted-foreground font-medium",
								children: selectedFile ? selectedFile.name : "Drag and drop or click to upload .csv"
							})]
						})]
					})]
				}), parsedRows.length > 0 && /* @__PURE__ */ jsxs("div", {
					className: "pt-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-xs font-semibold pb-2",
						children: [
							/* @__PURE__ */ jsxs("span", { children: ["Total Rows: ", parsedRows.length] }),
							/* @__PURE__ */ jsxs("span", {
								className: "text-emerald-600",
								children: ["Valid: ", parsedRows.filter((r) => r.isValid).length]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-destructive",
								children: ["Invalid: ", parsedRows.filter((r) => !r.isValid).length]
							})
						]
					}), /* @__PURE__ */ jsx(Button, {
						onClick: handleImportSubmit,
						className: "w-full",
						disabled: importMutation.isPending,
						children: importMutation.isPending ? "Importing..." : "Process Bulk Import"
					})]
				})]
			})]
		}), /* @__PURE__ */ jsxs(Card, {
			className: "md:col-span-2 border-border/60 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
				className: "font-display text-lg",
				children: "Import Preview & Results"
			}) }), /* @__PURE__ */ jsx(CardContent, { children: importResult ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-start gap-2.5",
					children: [/* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 mt-0.5 text-emerald-600" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
						className: "font-semibold",
						children: "Bulk Import Complete"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1",
						children: [
							"Successfully imported **",
							importResult.successCount,
							"** price records. Failed rows: **",
							importResult.errorCount,
							"**."
						]
					})] })]
				}), importResult.errorCount > 0 && /* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-xs font-bold uppercase tracking-wider text-destructive",
						children: "Import Failures Summary"
					}), /* @__PURE__ */ jsx("div", {
						className: "max-h-60 overflow-y-auto border rounded divide-y text-xs font-mono",
						children: importResult.errors.map((e, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-2 bg-destructive/5 text-destructive flex justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("span", { children: ["Row ", e.index + 2] }), /* @__PURE__ */ jsx("span", {
								className: "text-right",
								children: e.error
							})]
						}, idx))
					})]
				})]
			}) : parsedRows.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto max-h-[360px]",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-xs text-left",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b text-muted-foreground pb-2 uppercase tracking-wider font-semibold",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "pb-2",
								children: "Row"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2",
								children: "Market ID"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2",
								children: "Commodity ID"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 text-right",
								children: "Price"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2",
								children: "Date"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 text-right",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: parsedRows.map((r, idx) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b border-border/30 last:border-0 py-1.5",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "py-2 text-muted-foreground",
								children: r.rowNumber
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-2 text-muted-foreground font-mono",
								children: r.marketId || "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-2 text-muted-foreground font-mono",
								children: r.commodityId || "—"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-2 text-right font-semibold",
								children: ["₵", isNaN(r.priceGhs) ? "—" : r.priceGhs.toFixed(2)]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-2 text-muted-foreground",
								children: r.dateRecorded
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-2 text-right font-medium",
								children: r.isValid ? /* @__PURE__ */ jsx("span", {
									className: "text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-2xs",
									children: "Ready"
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-destructive bg-destructive/5 border border-destructive/10 px-2 py-0.5 rounded text-2xs",
									children: "Error"
								})
							})
						]
					}, idx)) })]
				})
			}) : /* @__PURE__ */ jsxs("div", {
				className: "text-center py-20 text-muted-foreground",
				children: [/* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-10 w-10 mx-auto text-muted-foreground/60 mb-2" }), /* @__PURE__ */ jsx("p", {
					className: "text-sm",
					children: "Upload a CSV file to inspect data and import."
				})]
			}) })]
		})]
	});
}
function SmsBroadcastTab() {
	const [triggering, setTriggering] = useState(false);
	const [broadcastLog, setBroadcastLog] = useState([]);
	const broadcastMutation = useMutation({
		mutationFn: async () => {
			setTriggering(true);
			const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
			const res = await fetch("/api/sms/send-alerts", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.message || err.error || "Failed to trigger broadcast.");
			}
			return res.json();
		},
		onSuccess: (res) => {
			setTriggering(false);
			setBroadcastLog((prev) => [`[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] Broadcast successful! Dispatched updates to ${res.broadcastCount || 0} active subscriber(s).`, ...prev]);
			toast.success(res.message || `Dispatched SMS updates to ${res.broadcastCount || 0} subscribers!`);
		},
		onError: (err) => {
			setTriggering(false);
			const message = err instanceof Error ? err.message : String(err);
			setBroadcastLog((prev) => [`[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] Broadcast failed: ${message}`, ...prev]);
			toast.error(message || "Failed to trigger broadcast.");
		}
	});
	return /* @__PURE__ */ jsxs(Card, {
		className: "max-w-xl border-border/60 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
			className: "font-display text-lg",
			children: "Trigger SMS Broadcast Alerts"
		}), /* @__PURE__ */ jsx(CardDescription, { children: "Manually broadcast the latest recorded prices of crops to all active SMS subscribers." })] }), /* @__PURE__ */ jsxs(CardContent, {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-primary/20 bg-primary/5 p-4 flex gap-3 text-sm text-primary",
					children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 mt-0.5 text-primary flex-shrink-0" }), /* @__PURE__ */ jsx("p", { children: "**Warning**: This action immediately dispatches SMS alerts through Africa's Talking. If in development mode, alerts will be logged directly to the server terminal." })]
				}),
				/* @__PURE__ */ jsx(Button, {
					onClick: () => broadcastMutation.mutate(),
					className: "w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white shadow-sm font-semibold cursor-pointer",
					disabled: triggering,
					children: triggering ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Dispatching Broadcast..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), " Trigger Alerts Broadcast"] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2 pt-2 border-t",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
						children: "Activity Log"
					}), /* @__PURE__ */ jsx("div", {
						className: "bg-muted/40 border rounded-lg p-3 min-h-[140px] max-h-[220px] overflow-y-auto font-mono text-2xs space-y-1.5 text-muted-foreground",
						children: broadcastLog.length > 0 ? broadcastLog.map((log, idx) => /* @__PURE__ */ jsx("p", { children: log }, idx)) : /* @__PURE__ */ jsx("p", {
							className: "text-center py-10 text-muted-foreground/80 italic",
							children: "No broadcast activity recorded in this session."
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { AdminPage as component };
