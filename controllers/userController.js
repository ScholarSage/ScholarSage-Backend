const User = require("../models/userModel");
const StudentMentor = require("../models/StudentMentorModel");
const PersonalityType = require("../models/personalityType");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const emailValidator = require("email-validator");
const moment = require("moment");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Set the destination folder for file uploads
const mongoose = require("mongoose");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const nodemailerUser = process.env.nodemailerUser;

const nodemailerUserPassword = process.env.nodemailerUserPassword;

const nodemailerReceiver = process.env.nodemailerReceiver;

const name = 123;

const StudentRegister = async (req, res) => {
  const { fname, lname, email, scnumber, password, confirmpassword, usertype } =
    req.body;

  try {
    if (!fname || fname.trim() === "") {
      console.log("First Name is required");
      return res.status(200).send({ error: "First Name is required" });
    }

    if (!lname || lname.trim() === "") {
      console.log("Last Name is required");
      return res.status(200).send({ error: "Last Name is required" });
    }

    if (!emailValidator.validate(email)) {
      console.log("Invalid Email");
      return res.status(200).send({ error: "Email is invalid" });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(200).json({ error: "Email Already Used" });
    }

    const scnumberRegx = /^SC\/\d{4}\/\d{5}$/;
    if (!scnumberRegx.test(scnumber)) {
      console.log("Invalid Student ID");
      return res.status(200).send({ error: "Invalid Student Number" });
    }

    const oldscnumber = await User.findOne({ scnumber });
    if (oldscnumber) {
      return res.status(200).json({ error: "Student Number Already Used" });
    }

    const passwordRegx =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
    if (!passwordRegx.test(password)) {
      console.log("Password format incorrect");
      return res.status(200).send({ error: "Password format incorrect" });
    }

    if (password !== confirmpassword) {
      console.log("Confirm Password DO Not Match"); //for security
      return res.status(200).json({ error: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);

    const encryptedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fname,
      lname,
      email,
      scnumber,
      password: encryptedPassword,
      usertype,
    });
    res.status(200).send({ status: "ok" });

    await StudentMentorAssign()
      .then((result) => {
        // res.status(200).send(result);
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        // res.status(500).send({ status: 'error', message: 'Error assigning mentor to student' });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error" });
  }
};

const MentorRegister = async (req, res) => {
  const { fname, lname, email, mentorid, password, confirmpassword, usertype } =
    req.body;

  try {
    if (!fname || fname.trim() === "") {
      console.log("First Name is required");
      return res.status(200).send({ error: "First Name is required" });
    }

    if (!lname || lname.trim() === "") {
      console.log("Last Name is required");
      return res.status(200).send({ error: "Last Name is required" });
    }

    if (!emailValidator.validate(email)) {
      console.log("Invalid Email");
      return res.status(200).send({ error: "Email is invalid" });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(200).json({ error: "Email Already Exists" });
    }

    const oldmentorid = await User.findOne({ mentorid });
    if (oldmentorid) {
      return res.status(200).json({ error: "Mentor ID Already Used" });
    }

    const passwordRegx =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
    if (!passwordRegx.test(password)) {
      console.log("Password format incorrect");
      return res.status(200).send({ error: "Password format incorrect" });
    }

    if (password !== confirmpassword) {
      console.log("Confirm Password DO Not Match"); //for security
      return res.status(200).json({ error: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);

    const encryptedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fname,
      lname,
      email,
      mentorid,
      password: encryptedPassword,
      usertype,
    });
    res.status(200).send({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error" });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
      });
      // if(res.status(201)){
      //     return res.json({status:"ok",data:token,UT:user.usertype});
      // }else{
      //     return res.json({error:"error"});
      // }

      return res.status(200).json({
        status: "ok",
        data: token,
        UT: user.usertype,
        isApproved: user.isApproved,
      });
    }
    res.status(200).json({ status: "error", error: "Invalid Password" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", status: "Error", error });
  }
};

const UserData = async (req, res) => {
  // const{token}=req.body;
  // try {
  //     const user = jwt.verify(token,JWT_SECRET,(err,res)=>{
  //         if(err){
  //             return "token expired";
  //         }
  //         return res;  //return user as decoded payload(include email)  (Return value is always returned to the first callback function)
  //     });
  //     console.log(user);
  //     if(user=="token expired"){
  //         return res.send({status:"error",data:"token expired"});
  //     }
  //     const useremail = user.email;
  //     User.findOne({email:useremail}).then((data)=>{
  //         res.send({status:"ok",data:data});
  //     }).catch((error)=>{
  //         res.send({status:"error",data:error});
  //     });
  // } catch (error) {

  // }
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    user.password = undefined;
    if (!user) {
      console.log("error line 201");
      return res
        .status(200)
        .send({ message: "User does not exists", status: "error" });
    } else {
      res.status(200).send({
        status: "ok",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting userData", status: "error" });
  }
};

const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:8081/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerUser,
        pass: nodemailerUserPassword,
      },
    });

    var mailOptions = {
      from: nodemailerUser,
      to: nodemailerReceiver,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        //console.log('Email sent: ' + info.response);
        res.send({ status: "Email has been sent" });
      }
    });
    console.log(link);
  } catch (error) {}
};

const ResetPasswordBeforeSubmit = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Link is Expired");
  }
};

const ResetPasswordAfterSubmit = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmpassword } = req.body;
  if (password !== confirmpassword) {
    console.log("password not matched with confirm password");
    return res.json({ status: "password not matched with confirm password" });
  }
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    //res.json({status:"Password Updated"});
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.send("Something Went Wrong");
  }
};

const MentorApproval = async (req, res) => {
  const { id, status } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);
  try {
    const mentor = await User.findOne({ _id: objectId });
    if (!mentor) {
      return res
        .status(200)
        .send({ status: "error", message: "Mentor not found" });
    }
    if (status === "ok") {
      mentor.isApproved = true;
      await mentor.save();
      res
        .status(200)
        .send({ status: "ok", message: "Mentor approved successfully" });
      const mentorApprovalMessage = `Hi ${mentor.fname}. Your mentor account of ScholarSage under ${mentor.email} has been approved successfully and now you can log in to your account`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: nodemailerUser,
          pass: nodemailerUserPassword,
        },
      });

      var mailOptions = {
        from: nodemailerUser,
        // to: mentor.email,
        to: nodemailerReceiver,
        subject: "ScholarSage Mentor Account Approval",
        text: mentorApprovalMessage,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          //console.log('Email sent: ' + info.response);
          res.send({ status: "Email has been sent" });
        }
      });

      await StudentMentorAssign()
        .then((result) => {
          // res.status(200).send(result);
          console.log(result);
        })
        .catch((error) => {
          console.error(error);
          // res.status(500).send({ status: 'error', message: 'Error assigning mentor to student' });
        });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Somthing went wrong" });
    console.log(error);
  }
};

const MentorRequestList = async (req, res) => {
  try {
    const mentors = await User.find({ usertype: "Mentor", isApproved: false });
    res.status(200).json({ status: "ok", data: mentors });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error getting mentor list" });
  }
};

const StudentMentorAssign = async () => {
  try {
    const Approvedmentors = await User.find({
      usertype: "Mentor",
      isApproved: true,
    });
    if (!Approvedmentors || Approvedmentors.length === 0) {
      return { status: "error", message: "No mentors to connect" };
    }

    const students = await User.find({ usertype: "Student" });
    if (!students) {
      return { status: "error", message: "No students to connect" };
    }

    const ConnectedStudents = await StudentMentor.distinct("studentID");

    const unconnectedStudents = students.filter(
      (student) => !ConnectedStudents.includes(student._id.toString())
    );

    let ConnectedMentors = await StudentMentor.distinct("mentorID");

    let unconnectedMentors = Approvedmentors.filter(
      (mentor) => !ConnectedMentors.includes(mentor._id.toString())
    );

    if (!unconnectedStudents || unconnectedStudents.length === 0) {
      return { status: "error", message: "All students are connected" };
    }

    let Results = [];

    console.log(unconnectedStudents[0]);
    console.log(unconnectedStudents[1]);
    console.log(unconnectedStudents[2]);
    console.log(unconnectedStudents[3]);
    console.log(unconnectedMentors[0]);

    for (let i = 0; i < unconnectedStudents.length; i++) {
      let targetStudentID = unconnectedStudents[i]._id;
      if (unconnectedMentors.length > 0) {
        let targetMentorID = unconnectedMentors[0]._id;
        await StudentMentor.create({
          studentID: targetStudentID,
          mentorID: targetMentorID,
        });
        Results.push({
          status: "ok",
          message: "Student Successfully Connected with a new Mentor",
        });
      } else {
        let result = await StudentMentor.aggregate([
          {
            $group: {
              _id: "$mentorID",
              studentCount: { $sum: 1 },
            },
          },
          {
            $sort: { studentCount: 1 },
          },
        ]);

        // Get the mentors with the least number of students
        let mentorsWithLeastStudents = result.filter(
          (mentor) => mentor.studentCount === result[0].studentCount
        );
        console.log(mentorsWithLeastStudents);
        if (mentorsWithLeastStudents[0].studentCount >= 10) {
          Results.push({
            status: "ok",
            message: "Mentors are busy. Wait for mentors are available",
          });
        } else {
          let targetMentor = mentorsWithLeastStudents[0]._id;
          await StudentMentor.create({
            studentID: targetStudentID,
            mentorID: targetMentor,
          });
        }
        Results.push({
          status: "ok",
          message: "Student Successfully Connected with a old Mentor",
        });
      }
      ConnectedMentors = await StudentMentor.distinct("mentorID");
      unconnectedMentors = Approvedmentors.filter(
        (mentor) => !ConnectedMentors.includes(mentor._id.toString())
      );
    }
    return Results;
  } catch (error) {
    console.log(error);
  }
};

const SaveChanges = async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    email,
    address,
    contactNumber,
    city,
    state,
    currentPassword,
    newPassword,
    confirmPassword,
    cancelChanges, // New parameter to check if the cancel button is clicked
  } = req.body;

  // Handle file upload (assuming you have a field named 'photo' in your form)
  const photoUrl = req.file ? req.file.path : null;

  try {
    // Get the current user
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }

    // Store the current photo URL in a temporary field
    const tempPhotoUrl = user.photoUrl;

    // Update user profile and photo in the database
    await User.updateOne(
      { _id: id },
      {
        $set: {
          fname: fname,
          lname: lname,
          email: email,
          address: address,
          contactNumber: contactNumber,
          city: city,
          state: state,
          photoUrl: cancelChanges ? tempPhotoUrl : photoUrl, // Use tempPhotoUrl if cancelChanges is true
        },
      }
    );

    // Change password if provided
    if (currentPassword && newPassword && confirmPassword) {
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.json({
          status: "error",
          message: "Invalid current password",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.json({
          status: "error",
          message: "New password and confirm password do not match",
        });
      }

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      await User.updateOne(
        { _id: id },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
    }

    res.json({ status: "ok", message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: "Error updating profile" });
  }
};

const DeletePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    await User.updateOne(
      { _id: id },
      {
        $unset: {
          photoUrl: "",
        },
      }
    );
    res.json({ status: "ok", message: "Photo deleted successfully." });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: "Error deleting photo" });
  }
};

const PersonalityTypes = async (req, res) => {
  const { value } = req.params;
  try {
    const personalityType = await PersonalityType.findOne({ value });
    if (!personalityType) {
      res.status(404).send("Personality type not found");
    } else {
      res.json(personalityType);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const UpdateProfile = async (req, res) => {
  const { id } = req.params;
  const { fname, lname, email, address, contactNumber, city, state } = req.body;

  try {
    User.updateOne(
      { _id: id },
      {
        $set: {
          fname: fname,
          lname: lname,
          email: email,
          address: address,
          contactNumber: contactNumber,
          city: city,
          state: state,
        },
      }
    );
    res.json({ status: "ok", message: "Profile updated successfully" });
  } catch (error) {
    res.json({ status: "error", message: "Error updating profile" });
  }
};

const UploadPhoto = async (req, res) => {
  // Add logic to handle file upload and update user's photo URL in the database
  // You may use libraries like multer for file uploads
  // Example: const photoUrl = req.file.path;

  const id = req.body;

  try {
    // Update user's photo URL in the database
    await User.updateOne(
      { _id: id },
      {
        $set: {
          photoUrl: photoUrl,
        },
      }
    );
    res.json({ status: "ok", message: "Photo uploaded successfully" });
  } catch (error) {
    res.json({ status: "error", message: "Error uploading photo" });
  }
};

const ChangePassword = async (req, res) => {
  const { id, currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.json({ status: "error", message: "Invalid current password" });
    }
    if (newPassword !== confirmPassword) {
      return res.json({
        status: "error",
        message: "New password and confirm password do not match",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: id },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.json({ status: "ok", message: "Password changed successfully" });
  } catch (error) {
    res.json({ status: "Error", message: "Error Changing Password" });
  }
};

const BookAppointment = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    const newAppoinment = new Appoinment(req.body);
    await newAppoinment.save();
    //pushing notifications to student based on his scnumber
    // const studen t = await student.findOne({ scnumber: req.body.scnumber });
    const user = await user.findOne({ mentorid: req.body.mentorid });

    user.unseenNotification.push({
      type: "new-appointment-request",
      message: `a new appoinment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/mentor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.Status(500).send({
      message: "Error booking a appointment",
      success: false,
      error,
    });
  }
};

const checkBookingAvailability = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const scnumber = req.body.mentorid;

    const appointments = await Appointments.find({
      mentorid,
      date,
      time: { $gte: fromTime, $lte: toTime },
      //status: "approved",
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointment available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.Status(500).send({
      message: "Error booking a appointment",
      success: false,
      error,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const mentor = await MentorRegister.findOne({
      mentorid: req.query.mentorid,
    });
    const appointments = await Appointment.find({
      mentorid: mentor.mentorid,
    });

    res.status(200).send({
      message: "Appointment fetched successfully ",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.Status(500).send({
      message: "Error fetching appointment",
      success: false,
      error,
    });
  }
};

const changeAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findOnebyIdAndUpdate(appointmentId, {
      status,
    });

    const student = await User.findOne({ scnumber: appointment.scnumber });
    const unseenNotifications = student.unseenNotification;

    unseenNotifications.push({
      typr: "Appointment-status-changed",
      messsage: `Your appointment status has been changed ${status}`,
      onClickPath: "/appointments",
    });
    await student.save();

    res.status(200).send({
      message: "Appointment status changed successfully",
      success: true,
      data: MentorRegister,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error Changing appointment status",
      success: false,
      error,
    });
  }
};

exports.StudentRegister = StudentRegister;
exports.MentorRegister = MentorRegister;
exports.LoginUser = LoginUser;
exports.UserData = UserData;
exports.ForgetPassword = ForgetPassword;
exports.ResetPasswordBeforeSubmit = ResetPasswordBeforeSubmit;
exports.ResetPasswordAfterSubmit = ResetPasswordAfterSubmit;
exports.SaveChanges = SaveChanges;
exports.UploadPhoto = UploadPhoto;
exports.DeletePhoto = DeletePhoto;
exports.MentorApproval = MentorApproval;
exports.MentorRequestList = MentorRequestList;
exports.PersonalityTypes = PersonalityTypes;

exports.UpdateProfile = UpdateProfile;

exports.ChangePassword = ChangePassword;
exports.BookAppointment = BookAppointment;
exports.getAppointments = getAppointments;
exports.changeAppointmentStatus = changeAppointmentStatus;
exports.checkBookingAvailability = checkBookingAvailability;
