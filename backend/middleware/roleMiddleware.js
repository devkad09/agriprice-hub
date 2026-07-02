const { pool } = require("../config/db");

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User context missing" });
      }

      const userRoles = Array.isArray(req.user.roles)
        ? req.user.roles
        : [];

      const hasAllowedRole = userRoles.some((role) => roles.includes(role));
      if (hasAllowedRole) {
        return next();
      }

      if (!pool) {
        return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
      }

      const result = await pool.query("SELECT role FROM user_roles WHERE user_id = $1", [
        req.user.id,
      ]);
      const activeRoles = result.rows.map((r) => r.role);
      const allow = activeRoles.some((role) => roles.includes(role));

      if (!allow) {
        return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
      }

      req.user.roles = activeRoles;
      next();
    } catch (err) {
      console.error("Role middleware error:", err);
      return res.status(500).json({ error: "Internal server error in role verification" });
    }
  };
};

module.exports = { requireRole };
