import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connectionString = process.env.MONGO_URI || "mongodb+srv://odeartanan:odaitanan@cluster0.q65mrun.mongodb.net/MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM";

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 30000, // 30 seconds for server selection
      socketTimeoutMS: 45000,          // 45 seconds for socket timeout
      connectTimeoutMS: 30000,         // 30 seconds for connection timeout
      maxPoolSize: 10,                 // Maximum number of connections
      minPoolSize: 5,                  // Minimum number of connections
    });

    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};
