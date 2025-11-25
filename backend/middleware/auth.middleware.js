import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    else if (req.cookies && req.cookies[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ NORMALIZE USER OBJECT (important fix)
    req.user = {
      id: decoded.id || decoded._id || decoded.userId
    };

    if (!req.user.id) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
