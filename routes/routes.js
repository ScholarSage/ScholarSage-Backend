const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  StudentRegister,
  MentorRegister,
  LoginUser,
  UserData,
  ForgetPassword,
  ResetPasswordBeforeSubmit,
  ResetPasswordAfterSubmit,
  SaveChanges,
  UploadPhoto,
  DeletePhoto,
  MentorApproval,
  MentorRequestList,
  PersonalityTypes,
  ChangePassword,
  BookAppointment,
  CheckBookingAvailability,
  GetAppointmentsStudent,
  GetAppointmentsMentor,
  ChangeAppointmentStatus,
  MarkAsSeen,
  DeleteAllNotifications,
} = require("../controllers/userController");

router.post("/StudentRegister", StudentRegister);
router.post("/MentorRegister", MentorRegister);
router.post("/login-user", LoginUser);
router.post("/userData", authMiddleware, UserData);
router.post("/forgot-password", ForgetPassword);
router.get("/reset-password/:id/:token", ResetPasswordBeforeSubmit);
router.post("/reset-password/:id/:token", ResetPasswordAfterSubmit);
router.post("/update-profile", SaveChanges);
router.post("/upload-photo", UploadPhoto);
router.post("/delete-photo", DeletePhoto);
router.put("/Approve-Mentor/:id/:status", MentorApproval);
router.post("/mentor-request-list", MentorRequestList);
router.get("/personality-types/:value", PersonalityTypes);

router.post("/delete-photo", DeletePhoto);
router.post("/change-password", ChangePassword);
router.post("/book-appointment", BookAppointment);
router.post("/check-booking-availability", CheckBookingAvailability);
router.get("/get-appointments-student", GetAppointmentsStudent);
router.get("/get-appointments-mentor", GetAppointmentsMentor);

router.post("/change-appointment-status", ChangeAppointmentStatus);
router.post("/mark-as-seen", MarkAsSeen);
router.post("/delete-all-notifications", DeleteAllNotifications);

module.exports = router;
