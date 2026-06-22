import { Link } from "@tanstack/react-router";
import { Sprout, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { useRole } from "@/lib/use-role";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

export function SiteHeader() {
  const { user, loading } = useAuth();
  const { canEditPrices } = useRole();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function signOut() {
    setMobileMenuOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sprout className="h-5 w-5" />
          </span>
          <span>AgriFarm</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Home
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/prices"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Prices
          </Link>
          <Link
            to="/search"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Search
          </Link>
          {user && (
            <Link
              to="/subscriptions"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              Alerts
            </Link>
          )}
          {user && canEditPrices && (
            <Link
              to="/officer"
              className="text-primary hover:text-primary/95 transition-colors font-medium"
              activeProps={{ className: "font-semibold underline underline-offset-4" }}
            >
              Officer Panel
            </Link>
          )}
        </nav>

        {/* Right Section: Auth & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {loading ? null : user ? (
              <>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-full border border-border/50">
                  <UserIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              Home
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground font-semibold" }}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/prices"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              Prices
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              Search
            </Link>
            {user && (
              <Link
                to="/subscriptions"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground font-semibold" }}
              >
                Alerts
              </Link>
            )}
            {user && canEditPrices && (
              <Link
                to="/officer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-primary hover:text-primary/95 font-medium"
                activeProps={{ className: "font-semibold" }}
              >
                Officer Panel
              </Link>
            )}

            {/* Mobile Auth Button */}
            <div className="border-t border-border pt-4 mt-2">
              {loading ? null : user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/auth">Sign in</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
