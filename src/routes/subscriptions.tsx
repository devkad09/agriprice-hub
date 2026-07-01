import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  listSubscriptions,
  createSubscription,
  toggleSubscription,
  deleteSubscription,
} from "@/lib/subscriptions.functions";
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
      const { data, error } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from("profiles")
        .update({ phone: newPhone })
        .eq("id", user!.id);
      if (error) throw error;
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
  const queryClient = useQueryClient();
  const [commodityId, setCommodityId] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const { data: commodities } = useQuery({
    queryKey: ["commodities-for-subs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commodities")
        .select("id, name, category")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (commodities?.length && !commodityId) {
      setCommodityId(commodities[0].id);
    }
  }, [commodities, commodityId]);

  const addMutation = useMutation({
    mutationFn: async (payload: { commodityId: string; frequency: "daily" | "weekly" }) => {
      return createSubscription(payload);
    },
    onSuccess: () => {
      toast.success("Subscribed to price alerts!");
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["stats-subs"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("unique")) {
        toast.error("You are already subscribed to this commodity!");
      } else {
        toast.error(message || "Failed to subscribe");
      }
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
  const queryClient = useQueryClient();
  const [deletingSub, setDeletingSub] = useState<SubscriptionRow | null>(null);

  const {
    data: subs,
    isLoading,
    error,
  } = useQuery<SubscriptionRow[]>({
    queryKey: ["user-subscriptions"],
    queryFn: async () => {
      const res = await listSubscriptions();
      return (res.subscriptions as unknown as SubscriptionRow[]) ?? [];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (payload: { id: string; active: boolean }) => {
      return toggleSubscription(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["stats-subs"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update subscription status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteSubscription({ id });
    },
    onSuccess: () => {
      toast.success("Subscription removed.");
      setDeletingSub(null);
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["stats-subs"] });
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
          <CardTitle className="font-display text-lg">Your Subscriptions</CardTitle>
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
                          toggleMutation.mutate({ id: sub.id, active: checked })
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
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
              onClick={() => deletingSub && deleteMutation.mutate(deletingSub.id)}
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
