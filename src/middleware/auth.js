import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authenticated" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mymayon_secret_change_in_prod");
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin || !req.admin.isActive)
      return res.status(401).json({ message: "Account inactive or not found" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin?.role))
      return res.status(403).json({ message: "Insufficient permissions" });
    next();
  };
}
