import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth, AUTH_TOKEN_KEY } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/backend-prices";

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
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();
      setBusy(false);

      if (!response.ok) {
        return toast.error(result.error || result.message || "Login failed");
      }

      localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
      toast.success("Welcome back!");
      navigate({ to: "/", replace: true });
    } catch (error) {
      setBusy(false);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Login failed");
    }
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
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
          name: parsed.data.fullName,
          phone: parsed.data.phone,
          region: parsed.data.region,
          role: "farmer",
        }),
      });
      const result = await response.json();
      setBusy(false);

      if (!response.ok) {
        return toast.error(result.error || result.message || "Registration failed");
      }

      localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
      toast.success("Account created. Welcome to AgriFarm!");
      navigate({ to: "/", replace: true });
    } catch (error) {
      setBusy(false);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Registration failed");
    }
  }

  return (
    <>
      <main className="relative grid min-h-screen md:grid-cols-2">
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-12 text-primary-foreground md:flex"
          style={{
            backgroundImage: `linear-gradient(135deg, oklch(0.35 0.1 145 / 0.85) 0%, oklch(0.45 0.13 150 / 0.9) 60%, oklch(0.55 0.15 90 / 0.9) 100%), url(/login-bg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
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
                          className="flex h-11 md:h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
    </>
  );
}


