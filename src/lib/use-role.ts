import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setRoles((data ?? []).map((r) => r.role));
        setLoading(false);
      });
  }, [user, authLoading]);

  return {
    roles,
    loading: authLoading || loading,
    isAdmin: roles.includes("admin"),
    isOfficer: roles.includes("data_officer"),
    isFarmer: roles.includes("farmer"),
    canEditPrices: roles.includes("data_officer") || roles.includes("admin"),
  };
}
