import { useEffect, useState } from "react";
import { useAuth, AppRole } from "./use-auth";

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

    setRoles(user.role ? [user.role] : []);
    setLoading(false);
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
