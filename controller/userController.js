import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { /*firstName*/ name, email, /*phonenic, dob, gender*/ password } =
    req.body;
  if (
    !name ||
    // !lastName ||
    !email ||
    /*  !phone ||
    !nic ||
    !dob ||
    !gender ||*/
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    //firstName,
    name,
    email,
    /* phone,
    nic,
    dob,
    gender,*/
    password,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, nic, dob, gender, password } = req.body;
  if (
    //  !firstName ||
    !name ||
    !email ||
    /*  !phone ||
    !nic ||
    !dob ||
    !gender ||*/
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    // firstName,
    name,
    email,
    /*   phone,
    nic,
    dob,
    gender,*/
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    name,
    //  lastName,
    email,
    phone,
    //   nic,
    //   dob,
    //   gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !name ||
    // !lastName ||
    !email ||
    !phone ||
    //  !nic ||
    // !dob ||
    //!gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    name,
    //  lastName,
    email,
    phone,
    //nic,
    // dob,
    //gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});
export const getDoctorDetails = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id; // Get the doctor ID from the route parameter

  // Find the doctor by ID
  const doctor = await User.findById(doctorId).select("-password"); // Exclude password from the result

  if (!doctor || doctor.role !== "Doctor") {
    return next(new ErrorHandler("Doctor Not Found!", 404));
  }

  res.status(200).json({
    success: true,
    doctor,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.params.id;

  // Check if the doctor exists
  const doctor = await User.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  // Delete the doctor
  await User.deleteOne({ _id: doctorId });

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
