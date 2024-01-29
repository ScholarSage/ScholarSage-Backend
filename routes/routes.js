const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { StudentRegister,MentorRegister,LoginUser,UserData,ForgetPassword,ResetPasswordBeforeSubmit,ResetPasswordAfterSubmit,SaveChanges,UploadPhoto,DeletePhoto} = require("../controllers/userController");
=======
const { StudentRegister,MentorRegister,LoginUser,UserData,ForgetPassword,ResetPasswordBeforeSubmit,ResetPasswordAfterSubmit,UpdateProfile,UploadPhoto,DeletePhoto,ChangePassword} = require("../controllers/userController");
>>>>>>> 4e173b6b597865411c898eb5de181d7a9bd26ac1

router.post("/StudentRegister",StudentRegister);
router.post("/MentorRegister",MentorRegister);
router.post("/login-user",LoginUser);
router.post("/userData",UserData);
router.post("/forgot-password",ForgetPassword);
router.get("/reset-password/:id/:token",ResetPasswordBeforeSubmit);
router.post("/reset-password/:id/:token",ResetPasswordAfterSubmit);
router.post("/update-profile",SaveChanges);
router.post("/upload-photo", UploadPhoto);
router.post("/delete-photo",DeletePhoto);


module.exports = router;


