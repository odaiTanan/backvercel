import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  await Message.create({ name, phone, message });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const message = await Message.findByIdAndDelete(id);

  if (!message) {
    return next(new ErrorHandler("Message not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Message Deleted!",
  });
});
