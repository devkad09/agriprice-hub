import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { listCommodities, BACKEND_URL } from "@/lib/backend-prices";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Loader2, Plus, Trash2, Bell, Smartphone, Check, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "SMS Subscriptions — AgriFarm" },
      {
        name: "description",
        content: "Subscribe to daily or weekly SMS alerts for crop price updates.",
      },
    ],
  }),
  component: SubscriptionsPage,
});

function SMSIllustrationCard() {
  return (
    <Card className="border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-harvest/5 shadow-[var(--shadow-card)] overflow-hidden">
      <CardContent className="p-5 flex flex-col items-center text-center">
        <div className="relative w-full max-w-[100px] aspect-[1/1.8] my-2">
          {/* Animated SVG Smartphone */}
          <svg
            viewBox="0 0 100 180"
            className="w-full h-full drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Phone Body */}
            <rect
              x="5"
              y="5"
              width="90"
              height="170"
              rx="15"
              fill="oklch(0.22 0.04 145)"
              stroke="var(--border)"
              strokeWidth="2"
            />
            {/* Screen */}
            <rect
              x="9"
              y="12"
              width="82"
              height="156"
              rx="10"
              fill="oklch(0.985 0.012 95)"
            />
            {/* Phone Speaker/Camera Notch */}
            <rect
              x="35"
              y="5"
              width="30"
              height="4"
              rx="2"
              fill="oklch(0.1 0.01 145)"
            />
            
            {/* SMS Message Bubble 1 (Tomatoes) */}
            <g transform="translate(14, 25)">
              <rect x="0" y="0" width="72" height="32" rx="6" fill="var(--primary)" />
              <polygon points="10,32 15,32 10,37" fill="var(--primary)" />
              <text x="8" y="12" fill="#ffffff" className="text-[6px] font-bold" fillOpacity={0.8}>AgriFarm Alert</text>
              <text x="8" y="24" fill="#ffffff" className="text-[7px] font-semibold">Tomatoes: GHS 720</text>
            </g>

            {/* SMS Message Bubble 2 (Maize) */}
            <g transform="translate(14, 70)">
              <rect x="0" y="0" width="72" height="32" rx="6" fill="oklch(0.42 0.07 55)" />
              <polygon points="62,32 57,32 62,37" fill="oklch(0.42 0.07 55)" />
              <text x="8" y="12" fill="#ffffff" className="text-[6px] font-bold" fillOpacity={0.8}>AgriFarm Alert</text>
              <text x="8" y="24" fill="#ffffff" className="text-[7px] font-semibold">Maize: GHS 310</text>
            </g>

            {/* Status bar dot indicators */}
            <circle cx="80" cy="18" r="1.5" fill="var(--primary)" />
            <circle cx="85" cy="18" r="1.5" fill="var(--primary)" />
          </svg>
        </div>
        <h3 className="font-display text-sm font-semibold mt-3">Offline SMS Alerts</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
          No internet required. Receive live market updates directly on your phone when prices change.
        </p>
      </CardContent>
    </Card>
  );
}

function SubscriptionsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">SMS Price Alerts</h1>
          <p className="mt-1 text-muted-foreground">
            Get instant crop prices delivered to your phone. Never miss market trends.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-1">
            <SMSIllustrationCard />
            <PhoneVerificationSection />
            <AddSubscriptionForm />
          </div>
          <div className="md:col-span-2">
            <SubscriptionsList />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

function PhoneVerificationSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-phone", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const json = await res.json();
      return json.data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

  const updatePhoneMutation = useMutation({
    mutationFn: async (newPhone: string) => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: newPhone }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update phone number");
      }
      return newPhone;
    },
    onSuccess: () => {
      toast.success("Phone number updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile-phone", user?.id] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update phone number");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Phone number cannot be empty.");
      return;
    }
    updatePhoneMutation.mutate(phone.trim());
  };

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardContent className="py-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const hasPhone = !!profile?.phone;

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Smartphone className="h-4.5 w-4.5 text-primary" />
          Alerts Phone Number
        </CardTitle>
        <CardDescription>All SMS updates will be sent here.</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone-input">Phone Number</Label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="e.g. +233241234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="flex-1"
                disabled={updatePhoneMutation.isPending}
              >
                {updatePhoneMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPhone(profile?.phone || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/40 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Active Number
                </p>
                <p className="font-display font-medium text-sm mt-0.5">
                  {hasPhone ? profile.phone : "No phone number set"}
                </p>
              </div>
              {hasPhone && <Check className="h-5 w-5 text-emerald-500" />}
            </div>
            {!hasPhone && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5 border border-amber-200">
                You must verify and save your phone number before you can receive SMS alerts.
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              {hasPhone ? "Change Phone Number" : "Set Phone Number"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddSubscriptionForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commodityId, setCommodityId] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const { data: commodities } = useQuery({
    queryKey: ["commodities-for-subs"],
    queryFn: async () => {
      return listCommodities();
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile-phone", user?.id],
    enabled: false,
  });

  useEffect(() => {
    if (commodities?.length && !commodityId) {
      setCommodityId(commodities[0].id);
    }
  }, [commodities, commodityId]);

  const addMutation = useMutation({
    mutationFn: async (payload: { commodityId: string; frequency: "daily" | "weekly" }) => {
      if (!profile?.phone) {
        throw new Error("Please set your phone number first.");
      }
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/sms/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: profile.phone,
          commodity_id: payload.commodityId,
          frequency: payload.frequency,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Failed to subscribe");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscribed to price alerts!");
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to subscribe");
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodityId) return;
    addMutation.mutate({ commodityId, frequency });
  };

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Bell className="h-4.5 w-4.5 text-primary" />
          Add Crop Alert
        </CardTitle>
        <CardDescription>Subscribe to alerts for a new crop.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sub-commodity">Crop / Commodity</Label>
            <select
              id="sub-commodity"
              value={commodityId}
              onChange={(e) => setCommodityId(e.target.value)}
              className="flex h-11 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {commodities?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sub-frequency">Alert Frequency</Label>
            <select
              id="sub-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
              className="flex h-11 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="daily">Daily price update</option>
              <option value="weekly">Weekly price digest</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={addMutation.isPending}>
            {addMutation.isPending ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface SubscriptionRow {
  id: string;
  active: boolean;
  frequency: "daily" | "weekly" | string;
  created_at: string;
  commodity: { id: string; name: string; category: string; unit_of_measure: string } | null;
}

function SubscriptionsList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deletingSub, setDeletingSub] = useState<SubscriptionRow | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile-phone", user?.id],
    enabled: false,
  });

  const {
    data: subs,
    isLoading,
    error,
  } = useQuery<SubscriptionRow[]>({
    queryKey: ["user-subscriptions"],
    queryFn: async () => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/sms/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (payload: { id: string; commodityId: string; active: boolean; frequency: string }) => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      if (payload.active) {
        if (!profile?.phone) {
          throw new Error("Please set your phone number first.");
        }
        const res = await fetch(`${BACKEND_URL}/api/sms/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone: profile.phone,
            commodity_id: payload.commodityId,
            frequency: payload.frequency,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || err.error || "Failed to activate subscription");
        }
      } else {
        const res = await fetch(`${BACKEND_URL}/api/sms/unsubscribe`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commodity_id: payload.commodityId,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || err.error || "Failed to pause subscription");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update subscription status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commodityId: string) => {
      const token = localStorage.getItem("AGRIFARM_AUTH_TOKEN");
      const res = await fetch(`${BACKEND_URL}/api/sms/unsubscribe`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commodity_id: commodityId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Failed to unsubscribe");
      }
    },
    onSuccess: () => {
      toast.success("Subscription removed.");
      setDeletingSub(null);
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to remove subscription");
    },
  });

  return (
    <>
      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary shrink-0" />
            Your Subscriptions
          </CardTitle>
          <CardDescription>Turn alerts on or off, or unsubscribe from commodities.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-center py-8 text-sm text-destructive">
              Failed to load subscriptions.
            </p>
          ) : !subs?.length ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground mb-4">You have no active SMS alerts.</p>
              <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto">
                Subscribe to crop updates using the form on the left to receive regular price
                updates straight to your phone.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subs.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-lg border border-border/55 p-4 hover:border-border transition-all"
                >
                  <div>
                    <h3 className="font-display font-semibold text-base">{sub.commodity?.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Category: {sub.commodity?.category} · Unit: {sub.commodity?.unit_of_measure}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-2xs font-semibold text-primary capitalize">
                      {sub.frequency} updates
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {sub.active ? "Active" : "Paused"}
                      </span>
                      <Switch
                        checked={sub.active}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({
                            id: sub.id,
                            commodityId: sub.commodity?.id ?? "",
                            active: checked,
                            frequency: sub.frequency,
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={() => setDeletingSub(sub)}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={deletingSub !== null}
        onOpenChange={(open) => !open && setDeletingSub(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsubscribe from Alerts?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop receiving SMS price updates for{" "}
              <span className="font-semibold text-foreground">{deletingSub?.commodity?.name}</span>?
              You can subscribe again at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSub?.commodity && deleteMutation.mutate(deletingSub.commodity.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Unsubscribing..." : "Unsubscribe"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
