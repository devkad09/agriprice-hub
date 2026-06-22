import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Loader2, Sparkles, User, Shield, Briefcase, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AgriFarm" },
      {
        name: "description",
        content:
          "Sign in or create an AgriFarm account to track Ghanaian market prices and subscribe to SMS alerts.",
      },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  region: z.string().trim().min(2, "Region required").max(100),
});

const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "Savannah",
  "North East",
];

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [mockOpen, setMockOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [user, loading, navigate]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/", replace: true });
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      password: fd.get("password"),
      phone: fd.get("phone"),
      region: fd.get("region"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: parsed.data.fullName,
          phone: parsed.data.phone,
          region: parsed.data.region,
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Welcome to AgriFarm!");
    navigate({ to: "/", replace: true });
  }

  async function handleGoogle() {
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_GOOGLE_SIGNIN !== "false") {
      setMockOpen(true);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setBusy(false);
      toast.error("Google sign-in failed: " + error.message);
    }
  }

  async function handleRealGoogle() {
    setBusy(true);
    setMockOpen(false);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setBusy(false);
      toast.error("Google sign-in failed: " + error.message);
    }
  }

  async function handleMockSignIn(
    email: string,
    name: string,
    role: "farmer" | "data_officer" | "admin",
  ) {
    setBusy(true);
    const password = "mock-google-password-123";

    // 1. Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // 2. If user doesn't exist, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
            phone: "+233240000000",
            region: "Greater Accra",
          },
        },
      });

      if (signUpError) {
        setBusy(false);
        toast.error("Mock sign-in failed: " + signUpError.message);
        return;
      }

      if (signUpData.session) {
        setBusy(false);
        toast.success(`Welcome to AgriFarm, ${name}!`);
        setMockOpen(false);
        navigate({ to: "/", replace: true });
        return;
      }

      setBusy(false);
      toast.success("Mock user registered successfully!");
      return;
    }

    setBusy(false);
    toast.success(`Welcome back, ${name}!`);
    setMockOpen(false);
    navigate({ to: "/", replace: true });
  }

  async function handleCustomMockSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("mock-email") as string;
    const name = fd.get("mock-name") as string;
    const role = fd.get("mock-role") as "farmer" | "data_officer" | "admin";

    if (!email || !name || !role) {
      toast.error("Please fill in all fields.");
      return;
    }

    await handleMockSignIn(email.trim(), name.trim(), role);
  }

  return (
    <>
      <main className="relative grid min-h-screen md:grid-cols-2">
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-12 text-primary-foreground md:flex"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur">
              <Sprout className="h-5 w-5" />
            </span>
            AgriFarm
          </Link>
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Fair prices.
              <br />
              Stronger farms.
            </h1>
            <p className="max-w-md text-base text-white/85">
              Real-time market prices from Makola, Kumasi, Kejetia, Techiman and Tamale — delivered
              to your phone, even without internet.
            </p>
          </div>
          <p className="text-sm text-white/70">
            Built for Ghanaian farmers · Powered by MoFA data officers
          </p>
        </div>

        <div className="flex items-center justify-center px-4 py-12 sm:px-8">
          <Card className="w-full max-w-md border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-1.5">
              <CardTitle className="font-display text-2xl">Welcome to AgriFarm</CardTitle>
              <CardDescription>Sign in or create an account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogle}
                disabled={busy}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-6 text-center text-xs uppercase tracking-wider text-muted-foreground">
                <span className="bg-card px-3 relative z-10">or</span>
                <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
              </div>

              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="si-email">Email</Label>
                      <Input
                        id="si-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="si-password">Password</Label>
                      <Input
                        id="si-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={busy}
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="su-name">Full name</Label>
                      <Input id="su-name" name="fullName" required maxLength={100} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="su-email">Email</Label>
                      <Input
                        id="su-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="su-phone">Phone</Label>
                        <Input
                          id="su-phone"
                          name="phone"
                          type="tel"
                          placeholder="+233 …"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="su-region">Region</Label>
                        <select
                          id="su-region"
                          name="region"
                          required
                          defaultValue=""
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="" disabled>
                            Select…
                          </option>
                          {GHANA_REGIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="su-password">Password</Label>
                      <Input
                        id="su-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        minLength={6}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={busy}
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                By continuing you agree to AgriFarm's terms of service.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={mockOpen} onOpenChange={setMockOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-6 rounded-xl animate-in fade-in-50 duration-200">
          <DialogHeader className="space-y-2 pb-4 border-b border-border/50">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Local Dev Sandbox
              </span>
            </div>
            <DialogTitle className="font-display text-2xl font-bold tracking-tight">
              Google Sign-In Simulator
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Since Google OAuth credentials are not configured on this Supabase backend, you can
              use this local sandbox to sign in with specific test roles.
            </DialogDescription>
          </DialogHeader>

          {/* Preset Roles Grid */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Select a Quick-Start Profile
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Farmer Card */}
              <button
                type="button"
                onClick={() => handleMockSignIn("farmer@agrifarm.dev", "Abebe Mensah", "farmer")}
                disabled={busy}
                className="group relative flex flex-col justify-between text-left p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-start justify-between w-full">
                  <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 group-hover:bg-emerald-500/20 transition-colors">
                    <User className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700">
                    Farmer
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-emerald-700 transition-colors">
                    Abebe Mensah
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    View market prices & configure SMS subscriptions.
                  </p>
                </div>
              </button>

              {/* Officer Card */}
              <button
                type="button"
                onClick={() => handleMockSignIn("officer@agrifarm.dev", "Ama Osei", "data_officer")}
                disabled={busy}
                className="group relative flex flex-col justify-between text-left p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-start justify-between w-full">
                  <span className="p-2 bg-blue-500/10 rounded-lg text-blue-600 group-hover:bg-blue-500/20 transition-colors">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-700">
                    Officer
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-blue-700 transition-colors">
                    Ama Osei
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    Record daily commodity prices across hubs.
                  </p>
                </div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleMockSignIn("admin@agrifarm.dev", "Kofi Boateng", "admin")}
                disabled={busy}
                className="group relative flex flex-col justify-between text-left p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-start justify-between w-full">
                  <span className="p-2 bg-purple-500/10 rounded-lg text-purple-600 group-hover:bg-purple-500/20 transition-colors">
                    <Shield className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-700">
                    Admin
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-purple-700 transition-colors">
                    Kofi Boateng
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    Access audit logs, manage markets and configurations.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Sandbox Form */}
          <div className="relative my-6 text-center text-xs uppercase tracking-wider text-muted-foreground">
            <span className="bg-background px-3 relative z-10">Or custom developer profile</span>
            <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
          </div>

          <form onSubmit={handleCustomMockSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mock-name">Full name</Label>
                <Input id="mock-name" name="mock-name" placeholder="e.g. Yao Mensah" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mock-email">Email address</Label>
                <Input
                  id="mock-email"
                  name="mock-email"
                  type="email"
                  placeholder="e.g. yao@gmail.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mock-role">Simulated User Role</Label>
              <select
                id="mock-role"
                name="mock-role"
                required
                defaultValue="farmer"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="farmer">Farmer (Default)</option>
                <option value="data_officer">Data Officer</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-[11px] text-muted-foreground">
                Note: Specifying custom roles requires the updated handle_new_user trigger in
                Supabase.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-700 hover:to-teal-600 transition-all cursor-pointer"
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Sign In & Register Sandbox User"
              )}
            </Button>
          </form>

          {/* Real Redirect Fallback */}
          <div className="pt-4 mt-2 border-t border-border/50 text-center">
            <button
              type="button"
              onClick={handleRealGoogle}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Trigger Real Google OAuth Redirect <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
