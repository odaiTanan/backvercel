import mongoose from "mongoose";

export const dbConnection = () => {
  // Use MONGO_URI instead of MONGODB_URI
  const connectionString = process.env.MONGO_URI || "mongodb+srv://odeartanan:odaitanan@cluster0.q65mrun.mongodb.net/";

  mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 5000,
  });

  mongoose.connection.on("connected", () => {
    console.log("✅ Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("🔌 MongoDB disconnected");
  });
};
