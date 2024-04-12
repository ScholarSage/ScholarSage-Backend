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
  address: { type: String },
  contactNumber: { type: String },
  city: { type: String },
  state: { type: String },
  profilePhoto: { type: String }, // Assuming you store the file path or URL
  seenNotifications: {
    type: Array,
    default: [],
  },
  unseenNotifications: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("UserInfo", UserDetailsSchema);

module.exports = User;
