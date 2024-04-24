const mongoose = require("mongoose");
const appoinmentSchema = new mongoose.Schema({
  scnumber: { type: String, required: true },
  mentorid: { type: String, required: true },
  studentInfo: { type: Object, required: true },
  mentorInfo: { type: Object, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, default: "Pending" },
});

const appointment = mongoose.model("appointment", appoinmentSchema);

module.exports = appointment;
