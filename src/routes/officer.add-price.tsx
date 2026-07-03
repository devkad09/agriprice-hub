import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listMarkets, listCommodities, addPrice } from "@/lib/backend-prices";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export const Route = createFileRoute("/officer/add-price")({
  head: () => ({
    meta: [
      { title: "Add Price — Officer Panel — AgriFarm" },
      { name: "description", content: "Record a new market price (Data Officers only)." },
    ],
  }),
  component: AddPricePage,
});

function AddPricePage() {
  return (
    <AppLayout>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold">Record Price</h1>
        <p className="mt-1 text-muted-foreground">Submit a daily price observation.</p>

        <div className="mt-6">
          <PriceEntryForm />
        </div>
      </main>
    </AppLayout>
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
      return listMarkets();
    },
  });

  const { data: commodities } = useQuery({
    queryKey: ["commodities-dropdown"],
    queryFn: async () => {
      return listCommodities();
    },
  });

  useEffect(() => {
    if (markets?.length && !marketId) setMarketId(markets[0].id);
  }, [markets, marketId]);

  useEffect(() => {
    if (commodities?.length && !commodityId) setCommodityId(commodities[0].id);
  }, [commodities, commodityId]);

  const mutation = useMutation({
    mutationFn: async (payload: { commodityId: string; marketId: string; priceGhs: number; dateRecorded: string }) => {
      return addPrice(payload);
    },
    onSuccess: () => {
      toast.success("Price entry created successfully!");
      setPriceGhs("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-latest-prices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["officer-recent-prices"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to create price entry");
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
    mutation.mutate({ commodityId, marketId, priceGhs: val, dateRecorded });
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
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm font-medium">₵</span>
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
