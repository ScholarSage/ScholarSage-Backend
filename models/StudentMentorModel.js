const mongoose = require('mongoose');

const StudentMentorSchema = new mongoose.Schema({
    studentID:{type:String,required:true},
    mentorID:{type:String,required:true}
});

const StudentMentor = mongoose.model("StudnetMentor",StudentMentorSchema);

module.exports = StudentMentor;