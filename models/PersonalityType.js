const mongoose = require('mongoose');

const personalityTypeSchema = new mongoose.Schema({ 
    value: { type: String, required: true, unique: true }, // Primary field 
    name: { type: String, required: true }, 
    description: { type: String, required: true }, 
});

const PersonalityType = mongoose.model('PersonalityType', personalityTypeSchema);

module.exports = PersonalityType;