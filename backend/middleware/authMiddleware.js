const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing or invalid token",
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "agrifarm-dev-secret");

    req.user = decoded;
    next();
  } catch (err) {
    console.error("[Auth] Token verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      error: err.message,
    });
  }
};

module.exports = authMiddleware;

  }
};

module.exports = authMiddleware;
