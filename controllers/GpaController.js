const Gpa = require('../models/GPAModel');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const getGPA = async (req, res) => {
    try {
      const sc = req.body.scnumber; // Assuming the user ID is stored in req.user._id after authentication
      const gpas = await Gpa.find({ scnumber:sc });
      const gpasWithoutScnumber = gpas.map(gpa => {
        const { scnumber, ...rest } = gpa.toObject();
        return rest;
      });
      res.json(gpasWithoutScnumber);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch GPAs' });
    }
  };
  

const addGPA = async (req, res) => {
    console.log(req.body);
    
    const { scnumber, name, grade, credits } = req.body;
    const newGpa = new Gpa({ scnumber, name, grade, credits });
    try {
      const savedGpa = await newGpa.save();
      res.json(savedGpa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add GPA' }); 
    }
  };

const updateGPA = async (req, res) => {
  const { id } = req.params;
  const {name,grade,credits} =req.body;
  const objectId = new mongoose.Types.ObjectId(id);
  console.log(id);
    try {
        
        await Gpa.updateOne(
            { _id: objectId },
            {
              $set: {
                name,
                grade,
                credits,
              },
            }
          );

          const updatedGpa = await Gpa.findById(objectId);
          const { scnumber, ...gpaWithoutScnumber } = updatedGpa.toObject();
                
    res.json({ message: 'GPA updated',data:gpaWithoutScnumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update GPA' });
   }
  };

  const deleteGPA = async (req, res) => {
    const { id } = req.params;
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      await Gpa.findByIdAndDelete(objectId);
      res.json({ message: 'GPA deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete GPA' });
    }
  };
  
exports.getGPA = getGPA;
exports.addGPA = addGPA;
exports.updateGPA = updateGPA;
exports.deleteGPA = deleteGPA;