import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import cloudinary from "cloudinary";

const app = express();

app.use(
  cors({
    origin: ["https://medicalcenter.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Fixed cloudinary config (removed space)
cloudinary.v2.config({
  cloud_name: "djmue5n4f",
  api_key: "332632149665272",
  api_secret: "IsJ5PE4tngjJ0W_ImZnHnDHsFHI",
});

// Routes
app.get("/", (req, res) => {
  res.send("✅ API is running on Vercel!");
});

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Database connection
dbConnection();

// Error middleware
app.use(errorMiddleware);

// Vercel serverless function export
export default app;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
}
