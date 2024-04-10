const express = require("express");
const router = express.Router();
const {
  StudentRegister,
  MentorRegister,
  LoginUser,
  UserData,
  ForgetPassword,
  ResetPasswordBeforeSubmit,
  ResetPasswordAfterSubmit,
  UpdateProfile,
  UploadPhoto,
  DeletePhoto,
  ChangePassword,
  BookAppointment,
  checkBookingAvailability,
  getAppointments,
  changeAppointmentStatus,
} = require("../controllers/userController");

router.post("/StudentRegister", StudentRegister);
router.post("/MentorRegister", MentorRegister);
router.post("/login-user", LoginUser);
router.post("/userData", UserData);
router.post("/forgot-password", ForgetPassword);
router.get("/reset-password/:id/:token", ResetPasswordBeforeSubmit);
router.post("/reset-password/:id/:token", ResetPasswordAfterSubmit);
router.post("/update-profile", UpdateProfile);
router.post("/upload-photo", UploadPhoto);
router.post("/delete-photo", DeletePhoto);
router.post("/change-password", ChangePassword);
router.post("/book-appointment", BookAppointment);
router.post("/check-booking-availability", checkBookingAvailability);
router.post("/get-appointments-by-user-id", getAppointments);
router.post("change-appointment-status", changeAppointmentStatus);

module.exports = router;
