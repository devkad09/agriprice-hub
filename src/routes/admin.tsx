import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { BACKEND_URL } from "@/lib/backend-prices";
import { useRole } from "@/lib/use-role";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  ShieldAlert,
  Users,
  History,
  FileSpreadsheet,
  Upload,
  Send,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// =========================================================================
// ROUTE REGISTRATION
// =========================================================================
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — AgriFarm" },
      {
        name: "description",
        content: "Admin Dashboard for managing users, audit logs, and bulk CSV imports.",
      },
    ],
  }),
  component: AdminPage,
});

// =========================================================================
// REACT COMPONENT PAGE
// =========================================================================
function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading, isAdmin } = useRole();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !roleLoading && user && !isAdmin) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, authLoading, roleLoading, isAdmin, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 shadow-sm">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 font-display text-2xl font-bold">Access Denied</h1>
            <p className="mt-2 text-muted-foreground">
              Only authorized Administrators can access this console.
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
              Admin Control Console
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage farmer roles, inspect audit records, import CSV prices, and trigger alerts.
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md sm:grid-cols-4 bg-muted/65 p-1 rounded-xl">
            <TabsTrigger value="users" className="flex items-center gap-1.5 rounded-lg py-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1.5 rounded-lg py-2">
              <History className="h-4 w-4" /> Audit Logs
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-1.5 rounded-lg py-2">
              <FileSpreadsheet className="h-4 w-4" /> Import CSV
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-1.5 rounded-lg py-2">
              <Send className="h-4 w-4" /> SMS Broadcast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogsTab />
          </TabsContent>

          <TabsContent value="import">
            <BulkImportTab />
          </TabsContent>

          <TabsContent value="sms">
            <SmsBroadcastTab />
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
}

// =========================================================================
// TAB: USER MANAGEMENT
// =========================================================================
function UserManagementTab() {
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async (payload: {
      targetUserId: string;
      role: "farmer" | "data_officer" | "admin";
    }) => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/admin/update-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: payload.targetUserId,
          role: payload.role,
        }),
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
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update role");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <AlertTriangle className="h-8 w-8 mx-auto" />
        <p className="mt-2 text-sm">Failed to load user profiles.</p>
        <Button onClick={() => refetch()} size="sm" variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="font-display text-lg">System User Profiles</CardTitle>
          <CardDescription>View all accounts and change user roles.</CardDescription>
        </div>
        <Button size="icon" variant="outline" onClick={() => refetch()} className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Full Name</th>
                <th className="pb-3 pr-4 font-medium">Phone</th>
                <th className="pb-3 pr-4 font-medium">Region</th>
                <th className="pb-3 pr-4 font-medium">Joined Date</th>
                <th className="pb-3 text-right font-medium">Access Role</th>
              </tr>
            </thead>
            <tbody>
              {(userData ?? []).map((u) => {
                const primaryRole = u.roles.includes("admin")
                  ? "admin"
                  : u.roles.includes("data_officer")
                    ? "data_officer"
                    : "farmer";

                return (
                  <tr
                    key={u.id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-foreground">
                      {u.full_name || "—"}
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{u.phone || "—"}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{u.region || "—"}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground whitespace-nowrap">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3.5 text-right">
                      <select
                        value={primaryRole}
                        onChange={(e) =>
                          changeRoleMutation.mutate({
                            targetUserId: u.id,
                            role: e.target.value as "farmer" | "data_officer" | "admin",
                          })
                        }
                        disabled={changeRoleMutation.isPending}
                        className="h-11 md:h-8 rounded-md border border-input bg-background px-2.5 py-1 text-sm md:text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring font-medium"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="data_officer">Data Officer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================================
// TAB: AUDIT LOGS
// =========================================================================
function AuditLogsTab() {
  const { data, isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/admin/audit-log`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <AlertTriangle className="h-8 w-8 mx-auto" />
        <p className="mt-2 text-sm">Failed to load audit logs.</p>
        <Button onClick={() => refetch()} size="sm" variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="font-display text-lg">System Audit Trail</CardTitle>
          <CardDescription>
            Logs of the last 100 modifications, creations, and updates.
          </CardDescription>
        </div>
        <Button size="icon" variant="outline" onClick={() => refetch()} className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Timestamp</th>
                <th className="pb-3 pr-4 font-medium">User</th>
                <th className="pb-3 pr-4 font-medium">Action</th>
                <th className="pb-3 pr-4 font-medium">Table</th>
                <th className="pb-3 pr-4 font-medium">Record ID</th>
                <th className="pb-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((l) => {
                let badgeColor = "bg-muted text-muted-foreground border-muted-foreground/20";
                if (l.action === "create") {
                  badgeColor = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
                } else if (l.action === "update") {
                  badgeColor = "bg-blue-500/10 text-blue-700 border-blue-500/20";
                } else if (l.action === "delete") {
                  badgeColor = "bg-destructive/10 text-destructive border-destructive/20";
                } else if (l.action === "update_role") {
                  badgeColor = "bg-purple-500/10 text-purple-700 border-purple-500/20";
                }

                return (
                  <tr
                    key={l.id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">
                      {l.created_at ? new Date(l.created_at).toLocaleString() : "—"}
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-foreground whitespace-nowrap">
                      {l.user_name || "System"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold capitalize ${badgeColor}`}
                      >
                        {l.action}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground font-mono">{l.table_name}</td>
                    <td
                      className="py-2.5 pr-4 text-muted-foreground font-mono whitespace-nowrap truncate max-w-[120px]"
                      title={l.record_id ?? ""}
                    >
                      {l.record_id || "—"}
                    </td>
                    <td
                      className="py-2.5 text-muted-foreground max-w-sm truncate"
                      title={JSON.stringify(l.details)}
                    >
                      {l.details ? JSON.stringify(l.details) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================================
// TAB: BULK IMPORT CSV
// =========================================================================
interface ParsedPriceRow {
  rowNumber: number;
  marketId: string;
  commodityId: string;
  priceGhs: number;
  dateRecorded: string;
  isValid: boolean;
}

interface ImportResult {
  successCount: number;
  errorCount: number;
  errors: Array<{
    index: number;
    row: any;
    error: string;
  }>;
  message?: string;
}

// =========================================================================
// TAB: BULK IMPORT CSV
// =========================================================================
function BulkImportTab() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedPriceRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${BACKEND_URL}/api/admin/bulk-import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to process bulk import.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    try {
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length < 2) {
        toast.error("CSV file must contain a header and at least one data row.");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
      const rows: Array<Record<string, string>> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
        const rowObj: Record<string, string> = {};
        headers.forEach((header, idx) => {
          rowObj[header] = values[idx];
        });
        rows.push(rowObj);
      }

      // Convert rows to schema structure
      const formatted = rows.map((r, idx) => {
        const marketId = r.market_id || r.marketId;
        const commodityId = r.commodity_id || r.commodityId;
        const priceVal = parseFloat(r.price_ghc || r.price_ghs || r.price);
        const dateVal = r.date_recorded || r.dateRecorded || new Date().toISOString().slice(0, 10);

        return {
          rowNumber: idx + 2,
          marketId,
          commodityId,
          priceGhs: priceVal,
          dateRecorded: dateVal,
          isValid: !!marketId && !!commodityId && !isNaN(priceVal) && priceVal > 0,
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

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Upload Price Data</CardTitle>
          <CardDescription>
            Select a CSV file to load crop prices. Columns must include:
            <code className="block mt-1 bg-muted p-1.5 rounded text-2xs font-mono">
              market_id, commodity_id, price_ghc, date_recorded
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="csv-file">CSV Data File</Label>
            <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/20 border-border hover:bg-muted/40 transition-colors relative cursor-pointer group">
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="mt-2 text-xs text-muted-foreground font-medium">
                  {selectedFile ? selectedFile.name : "Drag and drop or click to upload .csv"}
                </p>
              </div>
            </div>
          </div>

          {parsedRows.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold pb-2">
                <span>Total Rows: {parsedRows.length}</span>
                <span className="text-emerald-600">
                  Valid: {parsedRows.filter((r) => r.isValid).length}
                </span>
                <span className="text-destructive">
                  Invalid: {parsedRows.filter((r) => !r.isValid).length}
                </span>
              </div>
              <Button
                onClick={handleImportSubmit}
                className="w-full"
                disabled={importMutation.isPending}
              >
                {importMutation.isPending ? "Importing..." : "Process Bulk Import"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Import Preview & Results</CardTitle>
        </CardHeader>
        <CardContent>
          {importResult ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-start gap-2.5">
                <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-600" />
                <div>
                  <h4 className="font-semibold">Bulk Import Complete</h4>
                  <p className="mt-1">
                    Successfully imported **{importResult.successCount}** price records. Failed
                    rows: **{importResult.errorCount}**.
                  </p>
                </div>
              </div>

              {importResult.errorCount > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-destructive">
                    Import Failures Summary
                  </h4>
                  <div className="max-h-60 overflow-y-auto border rounded divide-y text-xs font-mono">
                    {importResult.errors.map((e, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-destructive/5 text-destructive flex justify-between gap-4"
                      >
                        <span>Row {e.index + 2}</span>
                        <span className="text-right">{e.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : parsedRows.length > 0 ? (
            <div className="overflow-x-auto max-h-[360px]">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b text-muted-foreground pb-2 uppercase tracking-wider font-semibold">
                    <th className="pb-2">Row</th>
                    <th className="pb-2">Market ID</th>
                    <th className="pb-2">Commodity ID</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((r, idx) => (
                    <tr key={idx} className="border-b border-border/30 last:border-0 py-1.5">
                      <td className="py-2 text-muted-foreground">{r.rowNumber}</td>
                      <td className="py-2 text-muted-foreground font-mono">{r.marketId || "—"}</td>
                      <td className="py-2 text-muted-foreground font-mono">
                        {r.commodityId || "—"}
                      </td>
                      <td className="py-2 text-right font-semibold">
                        ₵{isNaN(r.priceGhs) ? "—" : r.priceGhs.toFixed(2)}
                      </td>
                      <td className="py-2 text-muted-foreground">{r.dateRecorded}</td>
                      <td className="py-2 text-right font-medium">
                        {r.isValid ? (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-2xs">
                            Ready
                          </span>
                        ) : (
                          <span className="text-destructive bg-destructive/5 border border-destructive/10 px-2 py-0.5 rounded text-2xs">
                            Error
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-sm">Upload a CSV file to inspect data and import.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================================
// TAB: SMS BROADCAST
// =========================================================================
function SmsBroadcastTab() {
  const [triggering, setTriggering] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState<string[]>([]);

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      setTriggering(true);
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/sms/send-alerts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Failed to trigger broadcast.");
      }
      return res.json();
    },
    onSuccess: (res) => {
      setTriggering(false);
      setBroadcastLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Broadcast successful! Dispatched updates to ${res.broadcastCount || 0} active subscriber(s).`,
        ...prev,
      ]);
      toast.success(res.message || `Dispatched SMS updates to ${res.broadcastCount || 0} subscribers!`);
    },
    onError: (err: unknown) => {
      setTriggering(false);
      const message = err instanceof Error ? err.message : String(err);
      setBroadcastLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Broadcast failed: ${message}`,
        ...prev,
      ]);
      toast.error(message || "Failed to trigger broadcast.");
    },
  });

  return (
    <Card className="max-w-xl border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="font-display text-lg">Trigger SMS Broadcast Alerts</CardTitle>
        <CardDescription>
          Manually broadcast the latest recorded prices of crops to all active SMS subscribers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex gap-3 text-sm text-primary">
          <AlertTriangle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
          <p>
            **Warning**: This action immediately dispatches SMS alerts through Africa's Talking. If
            in development mode, alerts will be logged directly to the server terminal.
          </p>
        </div>

        <Button
          onClick={() => broadcastMutation.mutate()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white shadow-sm font-semibold cursor-pointer"
          disabled={triggering}
        >
          {triggering ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Dispatching Broadcast...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Trigger Alerts Broadcast
            </>
          )}
        </Button>

        <div className="space-y-2 pt-2 border-t">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Activity Log
          </h4>
          <div className="bg-muted/40 border rounded-lg p-3 min-h-[140px] max-h-[220px] overflow-y-auto font-mono text-2xs space-y-1.5 text-muted-foreground">
            {broadcastLog.length > 0 ? (
              broadcastLog.map((log, idx) => <p key={idx}>{log}</p>)
            ) : (
              <p className="text-center py-10 text-muted-foreground/80 italic">
                No broadcast activity recorded in this session.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
