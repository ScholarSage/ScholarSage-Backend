const mongoose = require('mongoose');

const personalityTypeSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true, primary: true }, // Primary field
  name: { type: String, required: true },
  description: { type: String, required: true },
  introduction: { type: String, required: true },
  strengths: { type: Array, required: true },
  weaknesses: { type: Array, required: true },
  imgUrl: { type: String, required: true }, 
  careerPaths: { type: String, required: true },
  conclusion: { type: String, required: true },
  romanticRelationships: { type: String, required: true },
  workplaceHabits: { type: Array, required: true },
  friendships: { type: String, required: true },
  parenthood: { type: String, required: true },
});

const PersonalityType = mongoose.model('PersonalityType', personalityTypeSchema);

module.exports = PersonalityType;
