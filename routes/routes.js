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
  MentorApproval,
  MentorRequestList,
  PersonalityTypes,
  ChangePassword,
  BookAppointment,
  checkBookingAvailability,
  getAppointments,
  changeAppointmentStatus,
  markAllNotificationsAsSeen,
  deleteAllNotifications,
} = require("../controllers/userController");

const {
  getGPA,
  addGPA,
  updateGPA,
  deleteGPA,
} = require("../controllers/GPAController");

const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource


} = require("../controllers/ResourceController");

router.post("/StudentRegister", StudentRegister);
router.post("/MentorRegister", MentorRegister);
router.post("/login-user", LoginUser);
router.post("/userData", authMiddleware, UserData);
router.post("/forgot-password", ForgetPassword);
router.get("/reset-password/:id/:token", ResetPasswordBeforeSubmit);
router.post("/reset-password/:id/:token", ResetPasswordAfterSubmit);
router.post("/saveChanges", SaveChanges);
router.post("/upload-photo", UploadPhoto);
router.put("/Approve-Mentor/:id/:status", MentorApproval);
router.post("/mentor-request-list", MentorRequestList);
router.get("/personality-types/:value", PersonalityTypes);

router.post("/change-password", ChangePassword);
router.post("/book-appointment", BookAppointment);
router.post("/check-booking-availability", checkBookingAvailability);
router.post("/get-appointments-by-user-id", getAppointments);
router.post("/change-appointment-status", changeAppointmentStatus);
router.post("/mark-all-notifications-as-seen", markAllNotificationsAsSeen);
router.post("/delete-all-notifications", deleteAllNotifications);

router.post("/get-GPA",getGPA);
router.post("/add-GPA",addGPA);
router.post("/update-GPA/:id",updateGPA);
router.delete("/delete-GPA/:id",deleteGPA);

router.post("/SaveGpa/:id",SaveGpa);

router.get("/resources", getResources);
router.get("/resources/:id", getResource);
router.post("/resources", createResource);
router.patch("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);

module.exports = router;
