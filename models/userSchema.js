import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, " Name Is Required!"],
    minLength: [3, "Name Must Contain At Least 3 Characters!"],
  },
  /* lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },*/
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
  } /*
  nic: {
    type: String,
    required: [true, "NIC Is Required!"],
    minLength: [13, "NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female"],
  },*/,
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, "XYZGHSJ12", {
    expiresIn: "7d",
  });
};

export const User = mongoose.model("User", userSchema);
