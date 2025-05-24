import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getAvailableSlots,
  getMyAppointments,
} from "../controller/appointmentController.js";

import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/available-slots", getAvailableSlots);
router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.delete("/cancel/:id", isPatientAuthenticated, deleteAppointment);
router.get("/myappointments", isPatientAuthenticated, getMyAppointments);
export default router;
