import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["super_admin", "editor", "viewer"], default: "editor" },
    isActive: { type: Boolean, default: true },
    lastLogin:{ type: Date },
  },
  { timestamps: true }
);

// Mongoose 7+ — async pre-save hooks must NOT call next(); return a promise instead
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("Admin", adminSchema);