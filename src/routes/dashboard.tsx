import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getPrices } from "@/lib/backend-prices";
import { useAuth } from "@/lib/use-auth";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  MapPin,
  Sprout,
  TrendingUp,
  Bell,
  ArrowRight,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgriFarm" },
      {
        name: "description",
        content: "Your AgriFarm dashboard with latest prices, trends, and subscriptions.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth", replace: true });
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.name || user.email?.split("@")[0]}
          </p>
        </div>
        <StatsCards />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LatestPricesTable />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

function StatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const cards = [
    {
      label: "Markets",
      value: stats?.markets ?? "—",
      icon: MapPin,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
    },
    {
      label: "Commodities",
      value: stats?.commodities ?? "—",
      icon: Sprout,
      color: "text-primary bg-primary/10 dark:bg-primary/20 dark:text-primary-foreground/80",
    },
    {
      label: "Price Entries",
      value: stats?.prices ?? "—",
      icon: BarChart3,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400",
    },
    {
      label: "Active Alerts",
      value: stats?.subscriptions ?? "—",
      icon: Bell,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card
          key={label}
          className="border-border/60 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <CardContent className="flex items-center gap-4 p-5">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-display text-2xl font-bold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LatestPricesTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-latest-prices"],
    queryFn: async () => {
      const rows = await getPrices({ limit: 200 });

      // Dedupe to latest per commodity+market
      const seen = new Set<string>();
      const latest = [];
      for (const r of rows ?? []) {
        const commodity = r.commodity;
        const market = r.market;
        if (!commodity || !market) continue;
        const key = `${commodity.name}:${market.name}`;
        if (seen.has(key)) continue;
        seen.add(key);
        latest.push({ ...r, commodity, market });
      }
      return latest.slice(0, 15);
    },
  });

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="font-display text-lg">Latest Prices</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/prices">
            View charts <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !data?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No price data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Commodity</th>
                  <th className="pb-3 pr-4 font-medium">Market</th>
                  <th className="pb-3 pr-4 text-right font-medium">Price (GHS)</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b border-border/40 last:border-0">
                    <td className="py-3 pr-4">
                      <span className="font-medium">{row.commodity.name}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        / {row.commodity.unit_of_measure}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.market.name}</td>
                    <td className="py-3 pr-4 text-right font-display font-semibold">
                      {Number(row.price_ghs).toFixed(2)}
                    </td>
                    <td className="py-3 text-muted-foreground">{row.date_recorded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-recent-activity"],
    queryFn: async () => {
      return getPrices({ limit: 8 });
    },
  });

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !data?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-4">
            {data.map((entry) => {
              const commodity = entry.commodity as { name: string } | null;
              const market = entry.market as { name: string } | null;
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {commodity?.name ?? "—"} at {market?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GHS {Number(entry.price_ghs).toFixed(2)} · {entry.date_recorded}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
