import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
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
    origin: ["http://localhost:5173"],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
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
cloudinary.v2.config({
  cloud_name: " djmue5n4f",
  api_key: "332632149665272",
  api_secret: "IsJ5PE4tngjJ0W_ImZnHnDHsFHI",
});
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();
app.listen(4000 || process.env.PORT, () => {
  console.log(`Server listening at port`);
});

app.use(errorMiddleware);
export default app;
