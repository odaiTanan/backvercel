import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, " Name Must Contain At Least 3 Characters!"],
  },

  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  message: {
    type: String,
    required: true,
    minLength: [10, "Message Must Contain At Least 10 Characters!"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
