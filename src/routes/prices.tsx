import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { listMarkets, listCommodities, BACKEND_URL } from "@/lib/backend-prices";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const commoditiesQuery = queryOptions({
  queryKey: ["commodities"],
  queryFn: async () => {
    return listCommodities();
  },
});

const marketsQuery = queryOptions({
  queryKey: ["markets"],
  queryFn: async () => {
    return listMarkets();
  },
});

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "Price Charts — AgriFarm" },
      {
        name: "description",
        content: "Interactive price trend charts for Ghanaian agricultural commodities.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(commoditiesQuery),
      context.queryClient.ensureQueryData(marketsQuery),
    ]),
  component: PricesPage,
});

const CHART_COLORS = [
  "oklch(0.55 0.15 145)",
  "oklch(0.7 0.15 80)",
  "oklch(0.5 0.1 55)",
  "oklch(0.65 0.15 35)",
  "oklch(0.45 0.1 170)",
];

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: 365 },
] as const;

function PricesPage() {
  return (
    <AppLayout fullWidth>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <PricesContent />
      </Suspense>
    </AppLayout>
  );
}

function PricesContent() {
  const { data: commodities } = useSuspenseQuery(commoditiesQuery);
  const { data: markets } = useSuspenseQuery(marketsQuery);

  const [selectedCommodity, setSelectedCommodity] = useState(commodities[0]?.id ?? "");
  const [selectedRange, setSelectedRange] = useState<number>(30);
  const [enabledMarkets, setEnabledMarkets] = useState<Set<string>>(
    new Set(markets.map((m) => m.id)),
  );

  const selectedCom = commodities.find((c) => c.id === selectedCommodity);

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ["price-trends", selectedCommodity, selectedRange],
    queryFn: async () => {
      if (!selectedCommodity) return [];
      const response = await fetch(`${BACKEND_URL}/api/prices/trends?commodity_id=${selectedCommodity}&days=${selectedRange}`);
      if (!response.ok) throw new Error("Failed to fetch price trends");
      return response.json();
    },
    enabled: !!selectedCommodity,
  });

  const { data: compareData } = useQuery({
    queryKey: ["price-compare", selectedCommodity],
    queryFn: async () => {
      if (!selectedCommodity) return [];
      const response = await fetch(`${BACKEND_URL}/api/prices/compare?commodity_id=${selectedCommodity}`);
      if (!response.ok) throw new Error("Failed to fetch comparisons");
      const rows = await response.json();
      return rows.map((r: any) => ({
        marketName: r.market_name,
        price: Number(r.price_ghs),
        date: r.date_recorded,
      })).sort((a: any, b: any) => a.price - b.price);
    },
    enabled: !!selectedCommodity,
  });

  // Build chart data: pivot by date, one key per market
  const chartData = (() => {
    if (!trendData?.length) return [];
    const byDate = new Map<string, Record<string, number | string>>();
    for (const r of trendData) {
      if (!enabledMarkets.has(r.market_id)) continue;
      const entry = byDate.get(r.date_recorded) ?? { date: r.date_recorded };
      entry[r.market_name] = Number(r.price_ghs);
      byDate.set(r.date_recorded, entry);
    }
    return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  })();

  const activeMarketNames = markets.filter((m) => enabledMarkets.has(m.id)).map((m) => m.name);

  function toggleMarket(id: string) {
    setEnabledMarkets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Price Charts</h1>
      <p className="mt-1 text-muted-foreground">
        Track commodity price trends across Ghana's markets
      </p>

      {/* Controls Layout with Map Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-4 items-start">
        <div className="md:col-span-3 space-y-5">
          <div className="flex flex-wrap items-end gap-4">
            {/* Commodity selector */}
            <div className="space-y-1.5">
              <label
                htmlFor="commodity-select"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Commodity
              </label>
              <select
                id="commodity-select"
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="flex h-9 w-56 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.unit_of_measure})
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Range
              </span>
              <div className="flex gap-1">
                {RANGES.map((r) => (
                  <Button
                    key={r.label}
                    variant={selectedRange === r.days ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRange(r.days)}
                    className="min-w-[3rem]"
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Market filter chips with colored markers */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Filter by Market (click map dots or chips)
            </span>
            <div className="flex flex-wrap gap-2">
              {markets.map((m, i) => {
                const isEnabled = enabledMarkets.has(m.id);
                const color = CHART_COLORS[i % CHART_COLORS.length];
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMarket(m.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      isEnabled
                        ? "border-transparent text-white shadow-sm scale-105"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    style={
                      isEnabled
                        ? { backgroundColor: color }
                        : undefined
                    }
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full transition-transform duration-300"
                      style={{
                        backgroundColor: isEnabled ? "#ffffff" : color,
                      }}
                    />
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ghana Map Widget */}
        <div className="md:col-span-1 border border-border/60 bg-card rounded-xl p-4 shadow-[var(--shadow-card)] flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Market Locations
          </span>
          <GhanaMap
            markets={markets}
            enabledMarkets={enabledMarkets}
            toggleMarket={toggleMarket}
            chartColors={CHART_COLORS}
          />
        </div>
      </div>

      {/* Line Chart */}
      <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">
            {selectedCom?.name ?? "—"} — Price Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendLoading ? (
            <div className="flex h-72 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !chartData.length ? (
            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-muted-foreground">No price data for this selection.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 130)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₵${v}`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid oklch(0.9 0.02 130)",
                    fontSize: "0.8rem",
                  }}
                  formatter={(value: number) => [`GHS ${value.toFixed(2)}`, undefined]}
                />
                <Legend />
                {activeMarketNames.map((name, i) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={
                      CHART_COLORS[markets.findIndex((m) => m.name === name) % CHART_COLORS.length]
                    }
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Comparison Bar Chart */}
      {compareData && compareData.length > 0 && (
        <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg">
              {selectedCom?.name ?? "—"} — Market Comparison (Latest)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={compareData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 130)" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `₵${v}`}
                />
                <YAxis type="category" dataKey="marketName" tick={{ fontSize: 12 }} width={160} />
                <Tooltip formatter={(value: number) => [`GHS ${value.toFixed(2)}`, "Price"]} />
                <Bar dataKey="price" radius={[0, 6, 6, 0]}>
                  {compareData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function GhanaMap({
  markets,
  enabledMarkets,
  toggleMarket,
  chartColors,
}: {
  markets: any[];
  enabledMarkets: Set<string>;
  toggleMarket: (id: string) => void;
  chartColors: string[];
}) {
  const marketMapInfo: Record<
    string,
    { x: number; y: number; colorIndex: number; align: "left" | "right" }
  > = {
    "Tamale": { x: 62, y: 50, colorIndex: 0, align: "right" },
    "Techiman": { x: 44, y: 90, colorIndex: 1, align: "left" },
    "Kejetia": { x: 42, y: 112, colorIndex: 2, align: "left" },
    "Kumasi Central": { x: 58, y: 114, colorIndex: 3, align: "right" },
    "Makola": { x: 76, y: 138, colorIndex: 4, align: "right" },
  };

  return (
    <div className="relative w-full max-w-[180px] aspect-[3/4]">
      <svg
        viewBox="0 0 120 160"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ghana outline path */}
        <path
          d="M 40 10 C 55 8, 70 8, 80 10 C 85 15, 82 25, 80 35 C 85 45, 90 55, 95 65 C 92 75, 92 85, 94 95 C 90 105, 82 115, 84 125 C 80 135, 75 142, 65 145 C 55 146, 45 145, 38 143 C 35 130, 25 125, 28 115 C 32 105, 28 95, 30 85 C 26 75, 25 65, 28 55 C 32 45, 35 30, 40 10 Z"
          fill="var(--primary)"
          fillOpacity={0.04}
          stroke="var(--primary)"
          strokeWidth={1}
          strokeDasharray="2 2"
          className="transition-all duration-300"
        />

        {/* Volta Lake representation */}
        <path
          d="M 75 80 Q 82 95 86 115 Q 84 120 78 110 T 70 95 Z"
          fill="oklch(0.7 0.15 190 / 0.15)"
          stroke="oklch(0.7 0.15 190 / 0.3)"
          strokeWidth={0.5}
        />

        {/* Market points */}
        {markets.map((m) => {
          const info = marketMapInfo[m.name];
          if (!info) return null;

          const isEnabled = enabledMarkets.has(m.id);
          const color = chartColors[info.colorIndex % chartColors.length];

          return (
            <g
              key={m.id}
              onClick={() => toggleMarket(m.id)}
              className="cursor-pointer group"
            >
              {/* Pulse effect for enabled markets */}
              {isEnabled && (
                <circle
                  cx={info.x}
                  cy={info.y}
                  r={6}
                  fill={color}
                  className="animate-ping opacity-25"
                />
              )}
              {/* Main marker dot */}
              <circle
                cx={info.x}
                cy={info.y}
                r={isEnabled ? 4 : 3}
                fill={isEnabled ? color : "oklch(var(--muted-foreground))"}
                stroke="#ffffff"
                strokeWidth={1}
                className="transition-all duration-300 group-hover:r-5 group-hover:stroke-primary"
              />
              {/* Market Name Label */}
              <text
                x={info.x + (info.align === "left" ? -6 : 6)}
                y={info.y + 3}
                textAnchor={info.align === "left" ? "end" : "start"}
                className={`text-[8px] font-semibold transition-colors duration-300 select-none ${
                  isEnabled
                    ? "fill-foreground font-bold"
                    : "fill-muted-foreground group-hover:fill-foreground"
                }`}
              >
                {m.name.replace(" Central", "")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

