import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { useRole } from "@/lib/use-role";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPrice, updatePrice, deletePrice } from "@/lib/prices.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ShieldAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/officer")({
  head: () => ({
    meta: [
      { title: "Officer Panel — AgriFarm" },
      { name: "description", content: "Data Officer portal for recording and managing agricultural crop prices." },
    ],
  }),
  component: OfficerPage,
});

function OfficerPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { canEditPrices, loading: roleLoading } = useRole();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !canEditPrices) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 font-display text-2xl font-bold">Access Denied</h1>
            <p className="mt-2 text-muted-foreground">
              Only authorized Data Officers or Admins can access this panel to record price data.
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Data Officer Panel</h1>
          <p className="mt-1 text-muted-foreground">
            Record, update, and manage market price entries.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PriceEntryForm />
          </div>
          <div className="lg:col-span-2">
            <RecentEntriesTable />
          </div>
        </div>
      </main>
    </div>
  );
}

function PriceEntryForm() {
  const queryClient = useQueryClient();
  const [marketId, setMarketId] = useState("");
  const [commodityId, setCommodityId] = useState("");
  const [priceGhs, setPriceGhs] = useState("");
  const [dateRecorded, setDateRecorded] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: markets } = useQuery({
    queryKey: ["markets-dropdown"],
    queryFn: async () => {
      const { data, error } = await supabase.from("markets").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: commodities } = useQuery({
    queryKey: ["commodities-dropdown"],
    queryFn: async () => {
      const { data, error } = await supabase.from("commodities").select("id, name, unit_of_measure").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Pre-fill first items once loaded
  useEffect(() => {
    if (markets?.length && !marketId) setMarketId(markets[0].id);
  }, [markets, marketId]);

  useEffect(() => {
    if (commodities?.length && !commodityId) setCommodityId(commodities[0].id);
  }, [commodities, commodityId]);

  const mutation = useMutation({
    mutationFn: async (payload: { commodityId: string; marketId: string; priceGhs: number; dateRecorded: string }) => {
      return createPrice(payload);
    },
    onSuccess: () => {
      toast.success("Price entry created successfully!");
      setPriceGhs("");
      queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create price entry");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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
      dateRecorded,
    });
  };

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="font-display text-lg">Record Daily Price</CardTitle>
        <CardDescription>Enter the observed price of a crop at a specific market.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="entry-market">Market</Label>
            <select
              id="entry-market"
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {markets?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entry-commodity">Commodity</Label>
            <select
              id="entry-commodity"
              value={commodityId}
              onChange={(e) => setCommodityId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {commodities?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.unit_of_measure})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entry-price">Price (GHS)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm font-medium">
                ₵
              </span>
              <Input
                id="entry-price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={priceGhs}
                onChange={(e) => setPriceGhs(e.target.value)}
                className="pl-7"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entry-date">Date Recorded</Label>
            <Input
              id="entry-date"
              type="date"
              value={dateRecorded}
              onChange={(e) => setDateRecorded(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Record Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface PriceRow {
  id: string;
  price_ghs: number;
  date_recorded: string;
  commodity: { id: string; name: string; unit_of_measure: string } | null;
  market: { id: string; name: string } | null;
}

function RecentEntriesTable() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingPrice, setEditingPrice] = useState<PriceRow | null>(null);
  const [editPriceVal, setEditPriceVal] = useState("");
  const [editDateVal, setEditDateVal] = useState("");
  const [deletingPrice, setDeletingPrice] = useState<PriceRow | null>(null);

  const { data: entries, isLoading, error } = useQuery<PriceRow[]>({
    queryKey: ["officer-recent-prices", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("prices")
        .select("id, price_ghs, date_recorded, commodity:commodities(id,name,unit_of_measure), market:markets(id,name)")
        .eq("recorded_by", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as any[]) ?? [];
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; priceGhs: number; dateRecorded: string }) => {
      return updatePrice(payload);
    },
    onSuccess: () => {
      toast.success("Price entry updated successfully!");
      setEditingPrice(null);
      queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update price entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deletePrice({ id });
    },
    onSuccess: () => {
      toast.success("Price entry deleted.");
      setDeletingPrice(null);
      queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete price entry");
    },
  });

  const handleEditClick = (price: PriceRow) => {
    setEditingPrice(price);
    setEditPriceVal(String(price.price_ghs));
    setEditDateVal(price.date_recorded);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
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
      dateRecorded: editDateVal,
    });
  };

  return (
    <>
      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Your Recent Price Entries</CardTitle>
          <CardDescription>A list of the last 50 prices you've recorded. You can edit or delete them here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-center py-8 text-sm text-destructive">Failed to load recent prices.</p>
          ) : !entries?.length ? (
            <p className="text-center py-12 text-sm text-muted-foreground">You haven't recorded any prices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Commodity</th>
                    <th className="pb-3 pr-4 font-medium">Market</th>
                    <th className="pb-3 pr-4 text-right font-medium">Price</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-medium">{entry.commodity?.name ?? "—"}</span>
                        <span className="ml-1.5 text-xs text-muted-foreground">/ {entry.commodity?.unit_of_measure}</span>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{entry.market?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-right font-display font-semibold">
                        ₵{Number(entry.price_ghs).toFixed(2)}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{entry.date_recorded}</td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(entry)}
                            className="h-8 w-8 hover:text-primary hover:bg-primary/5"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingPrice(entry)}
                            className="h-8 w-8 hover:text-destructive hover:bg-destructive/5"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editingPrice !== null} onOpenChange={(open) => !open && setEditingPrice(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Price Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Commodity</span>
              <p className="text-sm font-medium">{editingPrice?.commodity?.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Market</span>
              <p className="text-sm font-medium">{editingPrice?.market?.name}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (GHS)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                  ₵
                </span>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editPriceVal}
                  onChange={(e) => setEditPriceVal(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date Recorded</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDateVal}
                onChange={(e) => setEditDateVal(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingPrice(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deletingPrice !== null} onOpenChange={(open) => !open && setDeletingPrice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Price Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the recorded price of{" "}
              <span className="font-semibold text-foreground">
                ₵{Number(deletingPrice?.price_ghs).toFixed(2)}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-foreground">
                {deletingPrice?.commodity?.name}
              </span>{" "}
              at <span className="font-semibold text-foreground">{deletingPrice?.market?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPrice && deleteMutation.mutate(deletingPrice.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
