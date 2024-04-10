const mongoose = require("mongoose");
const appoinmentSchema = new mongoose.Schema({
  scnumber: { type: String, required: true },
  mentorid: { type: String, required: true },
  studentInfo: { type: String, required: true },
  mentorInfo: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
});

const appointmentModel = mongoose.model("appointment", appoinmentSchema);
module.exports = appointmentModel;
