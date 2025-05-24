import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://odeartanan:odaitanan@cluster0.q65mrun.mongodb.net/MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1); // ينهي التطبيق إذا فشل الاتصال
  }
};
