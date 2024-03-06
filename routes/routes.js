const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const { StudentRegister,MentorRegister,LoginUser,UserData,ForgetPassword,ResetPasswordBeforeSubmit,ResetPasswordAfterSubmit,SaveChanges,UploadPhoto,DeletePhoto,MentorApproval,MentorRequestList} = require("../controllers/userController");

router.post("/StudentRegister",StudentRegister);
router.post("/MentorRegister",MentorRegister);
router.post("/login-user",LoginUser);
router.post("/userData",authMiddleware,UserData);
router.post("/forgot-password",ForgetPassword);
router.get("/reset-password/:id/:token",ResetPasswordBeforeSubmit);
router.post("/reset-password/:id/:token",ResetPasswordAfterSubmit);
router.post("/update-profile",SaveChanges);
router.post("/upload-photo", UploadPhoto);
router.post("/delete-photo",DeletePhoto);
router.put("/Approve-Mentor/:id/:status",MentorApproval);
router.post("/mentor-request-list", MentorRequestList);


module.exports = router;


