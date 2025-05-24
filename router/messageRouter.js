import express from "express";
import {
  getAllMessages,
  sendMessage,
  deleteMessage,
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.delete("/message/:id", isAdminAuthenticated, deleteMessage);
router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;
