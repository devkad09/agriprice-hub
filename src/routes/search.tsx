import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listPrices } from "@/lib/prices.functions";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Calendar,
  Sprout,
} from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Prices — AgriFarm" },
      {
        name: "description",
        content: "Search and filter crop prices across different markets in Ghana.",
      },
    ],
  }),
  component: SearchPage,
});

interface PriceItem {
  id: string;
  price_ghs: number;
  date_recorded: string;
  created_at: string;
  commodity: { id: string; name: string; unit_of_measure: string; category: string } | null;
  market: { id: string; name: string; region: string } | null;
}

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [selectedSort, setSelectedSort] = useState("date-desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: markets } = useQuery({
    queryKey: ["search-markets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("id, name, region")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: priceData, isLoading } = useQuery<PriceItem[]>({
    queryKey: ["search-prices"],
    queryFn: async () => {
      const res = await listPrices({ limit: 500 });
      return (res.prices ?? []) as PriceItem[];
    },
  });

  // Extract unique categories from commodities
  const categories = useMemo(() => {
    if (!priceData) return [];
    const cats = new Set<string>();
    priceData.forEach((p) => {
      const c = p.commodity as { category: string } | null;
      if (c?.category) cats.add(c.category);
    });
    return Array.from(cats).sort();
  }, [priceData]);

  // Filter and sort prices
  const filteredAndSortedPrices = useMemo(() => {
    if (!priceData) return [];

    let result = [...priceData];

    // Search query (matches commodity name)
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((p) => {
        const name = (p.commodity as { name: string } | null)?.name?.toLowerCase();
        return name?.includes(query);
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const cat = (p.commodity as { category: string } | null)?.category;
        return cat === selectedCategory;
      });
    }

    // Market filter
    if (selectedMarket !== "all") {
      result = result.filter((p) => {
        const marketId = (p.market as { id: string } | null)?.id;
        return marketId === selectedMarket;
      });
    }

    // Date range filter
    if (startDate) {
      result = result.filter((p) => p.date_recorded >= startDate);
    }
    if (endDate) {
      result = result.filter((p) => p.date_recorded <= endDate);
    }

    // Sorting
    result.sort((a, b) => {
      const aName = (a.commodity as { name: string } | null)?.name || "";
      const bName = (b.commodity as { name: string } | null)?.name || "";
      const aPrice = Number(a.price_ghs);
      const bPrice = Number(b.price_ghs);
      const aDate = a.date_recorded;
      const bDate = b.date_recorded;

      switch (selectedSort) {
        case "price-asc":
          return aPrice - bPrice;
        case "price-desc":
          return bPrice - aPrice;
        case "name-asc":
          return aName.localeCompare(bName);
        case "name-desc":
          return bName.localeCompare(aName);
        case "date-asc":
          return aDate.localeCompare(bDate);
        case "date-desc":
        default:
          return bDate.localeCompare(aDate);
      }
    });

    return result;
  }, [priceData, searchTerm, selectedCategory, selectedMarket, startDate, endDate, selectedSort]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedMarket("all");
    setSelectedSort("date-desc");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Search Prices</h1>
          <p className="mt-1 text-muted-foreground">
            Search, filter, and sort crop price observations from markets across Ghana.
          </p>
        </div>

        {/* Search Bar & Reset */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search crops (e.g. Tomatoes, Maize, Yam)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <Button variant="outline" onClick={handleReset} className="h-11">
            Reset Filters
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
                <CardTitle className="font-display text-base font-bold">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <Label htmlFor="search-category">Category</Label>
                  <select
                    id="search-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Market */}
                <div className="space-y-1.5">
                  <Label htmlFor="search-market">Market</Label>
                  <select
                    id="search-market"
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="all">All Markets</option>
                    {markets?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="search-start-date">From Date</Label>
                  <Input
                    id="search-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="search-end-date">To Date</Label>
                  <Input
                    id="search-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-1.5">
                  <Label htmlFor="search-sort">Sort By</Label>
                  <select
                    id="search-sort"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="date-desc">Date (Newest first)</option>
                    <option value="date-asc">Date (Oldest first)</option>
                    <option value="price-desc">Price (Highest first)</option>
                    <option value="price-asc">Price (Lowest first)</option>
                    <option value="name-asc">Commodity Name (A-Z)</option>
                    <option value="name-desc">Commodity Name (Z-A)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAndSortedPrices.length === 0 ? (
              <Card className="border-border/60 shadow-[var(--shadow-card)] py-12">
                <CardContent className="text-center">
                  <p className="text-base text-muted-foreground mb-2">No matching prices found.</p>
                  <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto">
                    Try adjusting your search keywords, category filters, or selecting a wider date
                    range.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Showing {filteredAndSortedPrices.length} results</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredAndSortedPrices.map((row) => (
                    <Card
                      key={row.id}
                      className="border-border/60 shadow-[var(--shadow-card)] hover:border-border hover:shadow-md transition-all"
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Sprout className="h-5 w-5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-semibold text-base leading-tight truncate">
                              {row.commodity?.name}
                            </h3>
                            <span className="font-display font-bold text-base text-right shrink-0 whitespace-nowrap">
                              ₵{Number(row.price_ghs).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            Category: {row.commodity?.category} · Unit:{" "}
                            {row.commodity?.unit_of_measure}
                          </p>

                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 min-w-0">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{row.market?.name}</span>
                            </span>
                            <span className="flex items-center gap-1 shrink-0 ml-auto">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              <span>{row.date_recorded}</span>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
