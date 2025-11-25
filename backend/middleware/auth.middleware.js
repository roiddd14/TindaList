import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req, res, next) => {
  try {
    let token = null;

    // ✅ Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    // fallback to cookie (for local/dev)
    else if (req.cookies && req.cookies[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
