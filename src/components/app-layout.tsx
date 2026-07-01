import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function AppLayout({ children, className, fullWidth = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className={cn(fullWidth ? "w-full" : "mx-auto max-w-6xl px-4 py-8", className)}>
        {children}
      </div>
    </div>
  );
}
