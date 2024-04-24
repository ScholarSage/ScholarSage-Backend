const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  scnumber: String,
  name: String,
  grade: String,
  credits: Number,
});

const Gpa = mongoose.model('Gpa', courseSchema);

module.exports = Gpa;
//   module.exports = Gpa;
  
//   const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//     scnumber: String,
//     courses: {
//       type: Array,
//       default: [],
//     },
//     name: String,
//     grade: String,
//     credits: Number,
//   });
  
//   const Gpa = mongoose.model('Gpa', courseSchema);

  module.exports = Gpa;