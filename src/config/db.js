import mongoose from "mongoose";

export default async function connectDB() {
  // Accept either MONGO_URI or MONGODB_URI so both work
  const uri = "mongodb+srv://santhoshmkr0723:UpVFXPwYySxEGbXq@cluster0.a9xb5.mongodb.net/mymayon";

  try {
    await mongoose.connect(uri);
    console.log(`✓ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("✗ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
