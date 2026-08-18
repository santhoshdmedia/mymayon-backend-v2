import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET  = process.env.JWT_SECRET  || "mymayon_secret_change_in_prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const sign = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  if (!admin.isActive)
    return res.status(403).json({ message: "Account disabled" });

  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  res.json({
    token: sign(admin._id),
    admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
}

export async function getMe(req, res) {
  res.json({ admin: req.admin });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!(await admin.comparePassword(currentPassword)))
    return res.status(401).json({ message: "Current password incorrect" });
  admin.password = newPassword;
  await admin.save();
  res.json({ message: "Password updated" });
}
