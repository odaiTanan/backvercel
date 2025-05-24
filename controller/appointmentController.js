import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import dayjs from "dayjs";
export const getAvailableSlots = catchAsyncErrors(async (req, res, next) => {
  const { date, doctorId } = req.query;

  if (!date || !doctorId) {
    return next(new ErrorHandler("Date and doctorId are required", 400));
  }

  // تحويل التاريخ من صيغة "14-5-2025" إلى صيغة dayjs
  const [day, month, year] = date.split("-");
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
  const slotDate = dayjs(formattedDate);

  if (!slotDate.isValid()) {
    return next(new ErrorHandler("Invalid date format", 400));
  }

  // بداية اليوم ونهايته (لجلب جميع المواعيد في ذلك اليوم)
  const appointmentDate = slotDate.startOf("day").toDate();
  const nextDay = slotDate.add(1, "day").startOf("day").toDate();

  // جلب المواعيد الحالية للطبيب في نفس اليوم
  const appointments = await Appointment.find({
    doctorId,
    appointment_date: {
      $regex: `^${day}-${month}-${year}`, // البحث باستخدام regex لمطابقة التاريخ فقط
    },
  });

  // إعدادات الوقت (من الساعة 2 PM إلى الساعة 8 PM)
  const startHour = 2; // الساعة 2 PM
  const endHour = 8; // الساعة 8 PM

  const availableSlots = [];
  const dateStart = slotDate.startOf("day").hour(startHour); // تحديد بداية الساعة 2 PM

  // البحث عن المواعيد المتاحة في النطاق الزمني المحدد
  for (let hour = startHour; hour < endHour; hour++) {
    const slotStart = dateStart.hour(hour);
    const slotTimeString = `${day}-${month}-${year}-${hour
      .toString()
      .padStart(2, "0")}:00`;

    // تحقق إن كان هذا الوقت محجوزاً بالفعل
    const isTaken = appointments.some((app) => {
      // المقارنة مع السلسلة النصية المخزنة في قاعدة البيانات
      return app.appointment_date === slotTimeString;
    });

    if (!isTaken) {
      // إذا لم يكن محجوزاً، نضيفه إلى القائمة المتاحة
      availableSlots.push(slotStart.format("HH:00"));
    }
  }

  res.status(200).json({
    success: true,
    date: slotDate.format("DD-MM-YYYY"),
    availableSlots,
  });
});
export const getMyAppointments = catchAsyncErrors(async (req, res, next) => {
  const patientId = req.user._id; // يمكن استخدام بيانات المريض من التوكن أو الـ session

  if (!patientId) {
    return next(new ErrorHandler("Patient not found!", 404));
  }

  // البحث عن جميع المواعيد الخاصة بالمريض بناءً على الـ patientId
  const appointments = await Appointment.find({ patientId });

  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("No appointments found!", 404));
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_name,
    hasVisited,
  } = req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    name: doctor_name,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    name,
    email,
    phone,

    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      name: doctor_name,
    },
    hasVisited,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
