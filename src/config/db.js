import mongoose from "mongoose";

export default async function connectDB() {
  // Accept either MONGO_URI or MONGODB_URI so both work
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/mymayon";

  try {
    await mongoose.connect(uri);
    console.log(`✓ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("✗ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
