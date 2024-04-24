const mongoose = require("mongoose");

const personalityTypeSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, primary: true }, // Primary field
  name: { type: String, required: true },
  description: { type: String, required: true },
  introduction: { type: String, required: true },
  characteristics: { type: [String], required: true },
  imgIndex: { type: Number, required: true },
  strengths: { type: [String], required: true },
  weaknesses: { type: [String], required: true },
  quotes: { type: [String], required: true },
});

const PersonalityType = mongoose.model(
  "PersonalityType",
  personalityTypeSchema
);

module.exports = PersonalityType;
