const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
  fname: { type: String, required: String },
  lname: { type: String, required: String },
  email: { type: String, unique: true, required: String },
  password: { type: String, required: String },
  usertype: { type: String, required: String },
  scnumber: {
    type: String,
    required: function () {
      return this.usertype === "Student";
    },
  },
  mentorid: {
    type: String,
    required: function () {
      return this.usertype === "Mentor";
    },
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.usertype === "Mentor" ? false : undefined;
    },
    required: function () {
      return this.usertype === "Mentor";
    },
  },
  
  seenNotifications: {
    type: Array,
    default: [],
  },
  unseenNotifications: {
    type: Array,
    default: [],
  },

  address: { type: String, default: null },
  contactNumber: { type: String, default: null },
  profilePhoto: { type: String, default: null },
  degreeProgram: { type: String, default: null },
  academicLevel: { type: String, default: null },
  department: { type: String, default: null },
  faculty: { type: String, default: null },
}, { strict: false }

); 

const User = mongoose.model("UserInfo", UserDetailsSchema);

module.exports = User;
