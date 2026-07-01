import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  BarChart3,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/markets/$marketId")({
  head: () => ({
    meta: [
      { title: "Market Details — AgriFarm" },
      { name: "description", content: "View current commodity prices at this market." },
    ],
  }),
  component: MarketDetailPage,
});

function MarketDetailPage() {
  return (
    <AppLayout fullWidth>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <MarketContent />
      </Suspense>
    </AppLayout>
  );
}

function MarketContent() {
  const { marketId } = Route.useParams();

  const { data: market } = useQuery({
    queryKey: ["market-detail", marketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("*")
        .eq("id", marketId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: prices, isLoading } = useQuery({
    queryKey: ["market-prices", marketId],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("prices")
        .select(
          "id, price_ghs, date_recorded, commodity_id, commodity:commodities(id,name,unit_of_measure,category)",
        )
        .eq("market_id", marketId)
        .order("date_recorded", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;

      // Dedupe to latest per commodity, and find previous price for change indicator
      const latestMap = new Map<
        string,
        {
          id: string;
          commodityName: string;
          unit: string;
          category: string;
          commodityId: string;
          price: number;
          date: string;
          prevPrice: number | null;
        }
      >();
      const prevMap = new Map<string, number>();

      for (const r of rows ?? []) {
        const c = r.commodity as {
          id: string;
          name: string;
          unit_of_measure: string;
          category: string;
        } | null;
        if (!c) continue;
        if (!latestMap.has(c.id)) {
          latestMap.set(c.id, {
            id: r.id,
            commodityName: c.name,
            unit: c.unit_of_measure,
            category: c.category,
            commodityId: c.id,
            price: Number(r.price_ghs),
            date: r.date_recorded,
            prevPrice: null,
          });
        } else if (!prevMap.has(c.id)) {
          prevMap.set(c.id, Number(r.price_ghs));
        }
      }

      // Attach prev price
      const result = Array.from(latestMap.values()).map((item) => ({
        ...item,
        prevPrice: prevMap.get(item.commodityId) ?? null,
      }));

      return result.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.commodityName.localeCompare(b.commodityName),
      );
    },
  });

  if (!market) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to markets
        </Link>
      </Button>

      {/* Market Header */}
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">{market.name}</h1>
          <p className="text-muted-foreground">{market.region} Region</p>
          {market.description && (
            <p className="mt-1 text-sm text-muted-foreground">{market.description}</p>
          )}
        </div>
      </div>

      {/* Prices Table */}
      <Card className="mt-8 border-border/60 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !prices?.length ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No prices recorded for this market yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Commodity</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 text-right font-medium">Price (GHS)</th>
                    <th className="px-6 py-3 font-medium">Change</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((row) => {
                    const change =
                      row.prevPrice !== null
                        ? ((row.price - row.prevPrice) / row.prevPrice) * 100
                        : null;
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium">{row.commodityName}</span>
                          <span className="ml-1.5 text-xs text-muted-foreground">/ {row.unit}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-display text-base font-semibold">
                          {row.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {change !== null ? (
                            <span
                              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                                change > 0
                                  ? "text-emerald-600"
                                  : change < 0
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : change < 0 ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                        <td className="px-6 py-4">
                          <Button asChild variant="ghost" size="sm">
                            <Link to="/prices" search={{ commodity: row.commodityId }}>
                              <BarChart3 className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
