const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.supabase) {
        return res.status(401).json({ error: "Unauthorized: User context missing" });
      }

      // Query database for user's roles
      const { data: userRoles, error } = await req.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", req.user.id);

      if (error || !userRoles) {
        return res.status(403).json({ error: "Forbidden: Could not resolve user roles" });
      }

      const activeRoles = userRoles.map((r) => r.role);
      const hasAllowedRole = activeRoles.some((role) => roles.includes(role));

      if (!hasAllowedRole) {
        return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
      }

      next();
    } catch (err) {
      console.error("Role middleware error:", err);
      return res.status(500).json({ error: "Internal server error in role verification" });
    }
  };
};

module.exports = { requireRole };
