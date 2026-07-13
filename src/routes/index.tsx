import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { listMarkets, listCommodities } from "@/lib/backend-prices";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, MapPin, MessageSquareText, Sprout, Smartphone, TrendingUp } from "lucide-react";

const marketsQuery = queryOptions({
  queryKey: ["markets"],
  queryFn: async () => {
    return listMarkets();
  },
});

const commoditiesQuery = queryOptions({
  queryKey: ["commodities"],
  queryFn: async () => {
    return listCommodities();
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriFarm — Live Market Prices for Ghanaian Farmers" },
      {
        name: "description",
        content:
          "Real-time crop prices across 5 major Ghanaian markets, plus SMS alerts for offline farmers.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(marketsQuery),
      context.queryClient.ensureQueryData(commoditiesQuery),
    ]),
  component: Home,
  errorComponent: ({ error }) => (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-xl font-semibold">Couldn't load AgriFarm data</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </main>
  ),
});

function Home() {
  return (
    <AppLayout fullWidth>
      <Hero />
      <Suspense fallback={null}>
        <Features />
        <MarketsSection />
        <CommoditiesSection />
      </Suspense>
      <Footer />
    </AppLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden isolate">
      <div className="absolute inset-0 -z-10 hero-background-image" />
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live prices across Ghana
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Know the right price <span className="text-primary">before market day.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              AgriFarm gives Ghanaian farmers daily crop prices from 5 major markets — Makola,
              Kumasi, Kejetia, Techiman, and Tamale — plus SMS alerts when the price of your crop
              changes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/auth">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#markets">Browse markets</a>
              </Button>
            </div>
            
            {/* Stat Row with Icons */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <div>
                  <span className="font-display text-base font-bold text-foreground block leading-tight">5</span>
                  <span className="text-xs">markets</span>
                </div>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sprout className="h-4.5 w-4.5" />
                </span>
                <div>
                  <span className="font-display text-base font-bold text-foreground block leading-tight">20</span>
                  <span className="text-xs">commodities</span>
                </div>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Smartphone className="h-4.5 w-4.5" />
                </span>
                <div>
                  <span className="font-display text-base font-bold text-foreground block leading-tight">SMS</span>
                  <span className="text-xs">alerts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end">
            {/* Standalone Today's Price Preview Card */}
            <div className="w-full max-w-[380px] rounded-2xl border border-border bg-card/90 backdrop-blur-md p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Today · Makola Market
                  </p>
                  <p className="font-display text-lg font-semibold mt-1">Tomatoes (crate)</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <TrendingUp className="h-3 w-3" /> +4.2%
                </span>
              </div>
              <p className="mt-4 font-display text-4xl font-bold">GHS 720</p>
              <div className="mt-6 grid h-24 grid-cols-12 items-end gap-1.5">
                {[40, 55, 48, 62, 70, 58, 72, 68, 80, 75, 88, 95].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-t-sm bg-primary/80"
                    style={{ height: `${h}%`, opacity: 0.4 + i * 0.05 }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Past 12 days · sample preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: BarChart3,
      title: "Daily prices",
      body: "Up-to-date prices entered by MoFA data officers from every major market.",
    },
    {
      icon: MapPin,
      title: "Compare markets",
      body: "See which market pays best for your crop, side by side.",
    },
    {
      icon: MessageSquareText,
      title: "SMS alerts",
      body: "Subscribe to a commodity and get price updates by SMS — no internet needed.",
    },
    {
      icon: TrendingUp,
      title: "Price trends",
      body: "Track how prices move over weeks and months to plan when to sell.",
    },
  ];
  return (
    <section id="features" className="border-t border-border/60 bg-background py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Built for the way Ghana farms.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                AgriFarm puts real-time market information in every farmer's hand — from the smallholder in
                Bolgatanga to traders in Accra's busiest hubs.
              </p>
            </div>
            
            {/* Supporting Illustration */}
            <div className="mt-8 hidden lg:block overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[3/2] shadow-[var(--shadow-card)]">
              <img
                src="/hero-bg.jpg"
                alt="Ghanaian farmland showing growing crops"
                className="h-full w-full object-cover opacity-90 transition-opacity duration-300 hover:opacity-100"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, body }) => (
              <Card
                key={title}
                className="border-border/60 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getMarketImage(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("makola")) return "/makola-bg.png";
  if (normalized.includes("kumasi")) return "/kumasi-bg.png";
  if (normalized.includes("kejetia")) return "/kejetia-bg.png";
  if (normalized.includes("techiman")) return "/techiman-bg.png";
  if (normalized.includes("tamale")) return "/tamale-bg.png";
  return "/hero-bg.jpg";
}

function MarketsSection() {
  const { data } = useSuspenseQuery(marketsQuery);
  return (
    <section
      id="markets"
      className="border-t border-border/60 py-20"
      style={{ background: "var(--gradient-leaf)" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">5 markets, one network.</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Prices flow in daily from these regional hubs.
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((m) => (
            <Card
              key={m.id}
              className="group relative overflow-hidden isolate border-none shadow-[var(--shadow-card)] text-white min-h-[220px] flex flex-col justify-between"
            >
              {/* Background Image with Hover zoom */}
              <div
                className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${getMarketImage(m.name)})` }}
              />
              {/* Dark Overlay for text contrast */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />

              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white tracking-tight">
                      {m.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-zinc-300 font-medium">
                      {m.region} Region
                    </p>
                    {m.location_lat != null && m.location_lng != null && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
                          Lat: {Number(m.location_lat).toFixed(4)} · Lng: {Number(m.location_lng).toFixed(4)}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${m.location_lat},${m.location_lng}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-white bg-white/10 hover:bg-white/20 transition-colors px-2 py-0.5 rounded backdrop-blur border border-white/10"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white border border-white/10 backdrop-blur transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                </div>
                {m.description && (
                  <p className="mt-4 text-sm text-zinc-200 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommoditiesSection() {
  const { data } = useSuspenseQuery(commoditiesQuery);
  const grouped = data.reduce<Record<string, typeof data>>((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});
  return (
    <section id="commodities" className="border-t border-border/60 bg-background py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-bold md:text-4xl">20 commodities tracked.</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          From staples to cash crops — the prices farmers actually need.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              className="rounded-xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                {category}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {items.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.unit_of_measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          <span>AgriFarm · Accra Technical University FYP · Group 39</span>
        </div>
        <p>© {new Date().getFullYear()} AgriFarm. Built for Ghanaian farmers.</p>
      </div>
    </footer>
  );
}
