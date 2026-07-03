import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrices, updatePrice, deletePrice } from "@/lib/backend-prices";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/officer/manage-prices")({
  head: () => ({
    meta: [
      { title: "Manage Prices — Officer Panel — AgriFarm" },
      { name: "description", content: "Manage recorded market prices." },
    ],
  }),
  component: ManagePricesPage,
});

type PriceRow = {
  id: string;
  price_ghs: number;
  date_recorded: string;
  commodity: { id: string; name: string; unit_of_measure: string } | null;
  market: { id: string; name: string } | null;
};

function ManagePricesPage() {
  return (
    <AppLayout>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold">Manage Prices</h1>
        <p className="mt-1 text-muted-foreground">View, edit, and delete recorded price entries.</p>

        <div className="mt-6">
          <RecentEntriesTable />
        </div>
      </main>
    </AppLayout>
  );
}

function RecentEntriesTable() {
  const queryClient = useQueryClient();
  const [editingPrice, setEditingPrice] = useState<PriceRow | null>(null);
  const [editPriceVal, setEditPriceVal] = useState("");
  const [editDateVal, setEditDateVal] = useState("");
  const [deletingPrice, setDeletingPrice] = useState<PriceRow | null>(null);

  const { data: entries, isLoading, error } = useQuery<PriceRow[]>({
    queryKey: ["manage-prices"],
    queryFn: async () => {
      return getPrices({ limit: 500 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; priceGhs: number; dateRecorded: string }) => {
      return updatePrice(payload);
    },
    onSuccess: () => {
      toast.success("Price entry updated successfully!");
      setEditingPrice(null);
      queryClient.invalidateQueries({ queryKey: ["manage-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update price entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deletePrice(id);
    },
    onSuccess: () => {
      toast.success("Price entry deleted.");
      setDeletingPrice(null);
      queryClient.invalidateQueries({ queryKey: ["manage-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to delete price entry");
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
    updateMutation.mutate({ id: editingPrice.id, priceGhs: val, dateRecorded: editDateVal });
  };

  return (
    <>
      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Recorded Prices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-center py-8 text-sm text-destructive">Failed to load prices.</p>
          ) : !entries?.length ? (
            <p className="text-center py-12 text-sm text-muted-foreground">No prices recorded yet.</p>
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
                    <tr
                      key={entry.id}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-medium">{entry.commodity?.name ?? "—"}</span>
                        <span className="ml-1.5 text-xs text-muted-foreground">/ {entry.commodity?.unit_of_measure}</span>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{entry.market?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-right font-display font-semibold">₵{Number(entry.price_ghs).toFixed(2)}</td>
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
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">₵</span>
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
              <Input id="edit-date" type="date" value={editDateVal} onChange={(e) => setEditDateVal(e.target.value)} required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingPrice(null)}>Cancel</Button>
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

      <AlertDialog open={deletingPrice !== null} onOpenChange={(open) => !open && setDeletingPrice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Price Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the recorded price of <span className="font-semibold text-foreground">₵{Number(deletingPrice?.price_ghs).toFixed(2)}</span> for <span className="font-semibold text-foreground">{deletingPrice?.commodity?.name}</span> at <span className="font-semibold text-foreground">{deletingPrice?.market?.name}</span>? This action cannot be undone.
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
