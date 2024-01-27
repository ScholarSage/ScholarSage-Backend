const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailValidator = require("email-validator");

require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;

const nodemailerUser = process.env.nodemailerUser;

const nodemailerUserPassword = process.env.nodemailerUserPassword;

const nodemailerReceiver = process.env.nodemailerReceiver;


const StudentRegister = async(req,res)=>{
    const {fname,lname,email,scnumber,password,confirmpassword,usertype}= req.body;
    
    try {
    
        if (!fname || fname.trim() === "") {
            console.log("First Name is required");
            return res.send({ error: 'First Name is required' });
          }

          if (!lname || lname.trim() === "") {
            console.log("Last Name is required");
            return res.send({ error: 'Last Name is required' });
          }
    
        if(!emailValidator.validate(email)){
            console.log("Invalid Email");
            return res.send({error:'Email is invalid'});
    
        }
    
        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.json({error:"Email Already Used"});
        }
    
        const scnumberRegx = /^SC\/\d{4}\/\d{5}$/;
        if(!scnumberRegx.test(scnumber)){
            console.log("Invalid Student ID");
            return res.send({error:"Invalid Student Number"});
        }
    
        const oldscnumber = await User.findOne({scnumber});
        if(oldscnumber){
            return res.json({error:"Student Number Already Used"});
        }
    
        const passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
        if(!passwordRegx.test(password)){
            console.log("Password format incorrect");
            return res.send({error:"Password format incorrect"});
        }
    
        if (password !== confirmpassword) {
            console.log("Confirm Password DO Not Match");   //for security
            return res.json({ error: 'Passwords do not match' });
          }
        
        const encryptedPassword = await bcrypt.hash(password,10);
    
        await User.create({
            fname,
            lname,
            email,
            scnumber,
            password:encryptedPassword,
            usertype,
        });
        res.send({status:"ok"}) 
        }catch (error) {
            res.send({status:"error"})
        }
    };

    const MentorRegister = async(req,res)=>{
        const {fname,lname,email,mentorid,password,confirmpassword,usertype}= req.body;
        
        try {
    
            if (!fname || fname.trim() === "") {
                console.log("First Name is required");
                return res.send({ error: 'First Name is required' });
              }
    
              if (!lname || lname.trim() === "") {
                console.log("Last Name is required");
                return res.send({ error: 'Last Name is required' });
              }
    
            if(!emailValidator.validate(email)){
                console.log("Invalid Email");
                return res.send({error:'Email is invalid'});
            }
        
            const oldUser = await User.findOne({email});
            if(oldUser){
                return res.json({error:"Email Already Exists"});
            }
    
            const oldmentorid = await User.findOne({mentorid});
            if(oldmentorid){
            return res.json({error:"Mentor ID Already Used"});
            }
    
            const passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
            if(!passwordRegx.test(password)){
            console.log("Password format incorrect");
            return res.send({error:"Password format incorrect"});
            }
    
            if (password !== confirmpassword) {
            console.log("Confirm Password DO Not Match");   //for security
            return res.json({ error: 'Passwords do not match' });
            }
    
            const encryptedPassword = await bcrypt.hash(password,10);
    
            await User.create({
                fname,
                lname,
                email,
                mentorid,
                password:encryptedPassword,
                usertype,
            });
            res.send({status:"ok"}) 
            }catch (error) {
                res.send({status:"error"})
            }
        };

        const LoginUser = async(req,res)=>{
            const {email,password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.json({error:"User Not found"});
            }
            if(await bcrypt.compare(password,user.password)){
                const token = jwt.sign({email:user.email},JWT_SECRET,{
                    expiresIn:"24h",
                });
                if(res.status(201)){
                    return res.json({status:"ok",data:token,UT:user.usertype});
                }else{
                    return res.json({error:"error"});
                }
            }
            res.json({status:"error",error:"Invalid Password"});
        };

        const UserData = async(req,res)=>{
            const{token}=req.body;
            try {
                const user = jwt.verify(token,JWT_SECRET,(err,res)=>{
                    if(err){
                        return "token expired";
                    }
                    return res;  //return user as decoded payload(include email)  (Return value is always returned to the first callback function)
                });
                console.log(user);
                if(user=="token expired"){
                    return res.send({status:"error",data:"token expired"});
                }
                const useremail = user.email;
                User.findOne({email:useremail}).then((data)=>{
                    res.send({status:"ok",data:data});
                }).catch((error)=>{
                    res.send({status:"error",data:error});
                });
            } catch (error) {
                
            }
        };

        const ForgetPassword = async(req,res)=>{
            const {email} = req.body;
            try {
                const oldUser = await User.findOne({email});
                if(!oldUser){
                    return res.json({status:"User Not Exists!!"});
                }
                const secret = JWT_SECRET + oldUser.password;
                const token = jwt.sign({email:oldUser.email,id:oldUser._id},secret,{
                    expiresIn:"5m",
                });
                const link = `http://localhost:8081/reset-password/${oldUser._id}/${token}`;
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: nodemailerUser,
                      pass: nodemailerUserPassword
                    }
                  });
                  
                  var mailOptions = {
                    from: nodemailerUser,
                    to: nodemailerReceiver,
                    subject: 'Password Reset',
                    text: link
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      //console.log('Email sent: ' + info.response);
                      res.send({status:"Email has been sent"});
                    }
                  });
                console.log(link);
            } catch (error) {
                
            }
        };

        const ResetPasswordBeforeSubmit = async(req,res)=>{
            const {id,token} = req.params;
            console.log(req.params);
            const oldUser = await User.findOne({_id:id});
            if(!oldUser){
                return res.json({status:"User Not Exists!!"});
            }
            const secret = JWT_SECRET + oldUser.password;
            try {
                const verify = jwt.verify(token,secret);
                res.render("index",{email:verify.email,status:"Not Verified"});
            } catch (error) {
                console.log(error);
                res.send("Link is Expired");
            }
        };

        const ResetPasswordAfterSubmit = async(req,res)=>{
            const {id,token} = req.params;
            const {password,confirmpassword} = req.body;
             if(password !== confirmpassword){
                 console.log("password not matched with confirm password");
                 return res.json({status:"password not matched with confirm password"});
             }
            const oldUser = await User.findOne({_id:id});
            if(!oldUser){
                return res.json({status:"User Not Exists!!"});
            }
            const secret = JWT_SECRET + oldUser.password;
            try {
                const verify = jwt.verify(token,secret);
                const encryptedPassword = await bcrypt.hash(password,10);
                await User.updateOne(
                    {
                        _id:id,
                    },
                    {
                        $set:{
                            password:encryptedPassword,
                        },
                    }
                );
                //res.json({status:"Password Updated"});
                res.render("index",{email:verify.email,status:"verified"});
            } catch (error) {
                console.log(error);
                res.send("Something Went Wrong");
            }
        };

        const UpdateProfile=async(req,res)=>{
            const {id}=req.params;
            const{fname,lname,email,address,contactNumber,city,state}=req.body;

            try{
                User.updateOne(
                    {_id:id},
                    {
                        $set:{
                           fname:fname,
                           lname:lname,
                           email:email,
                           address:address,
                           contactNumber:contactNumber,
                           city:city,
                           state:state
                        },
                    }
                );
                res.json({status:"ok",message:"Profile updated successfully"});
            }catch(error){
                res.json({status:"error",message:"Error updating profile"});
            }
        };

        const UploadPhoto=async(req,res)=>{
            // Add logic to handle file upload and update user's photo URL in the database
            // You may use libraries like multer for file uploads
            // Example: const photoUrl = req.file.path;

            const id=req.body;

            try{
                // Update user's photo URL in the database
                await User.updateOne(
                    {_id:id},
                    {
                        $set:{
                            photoUrl:photoUrl,
                        },
                    }
                );
                res.json({status:"ok",message:"Photo uploaded successfully"});
            }catch(error){
                res.json({status:"error",message:"Error uploading photo"})
            }
        };

        const DeletePhoto=async(req,res)=>{
            const userId=req.body.userId;

            try{
                await User.updateOne(
                    {_id:userId},
                    {
                        $unset:{
                            photoUrl:"",
                        },
                    }
                );
                res,json({status:"ok",message:"Photo deleted successfully."});
            }catch(error){
                res.json({status:"error",message:"Error deleting photo"});
            }
        };

        const ChangePassword=async(req,res)=>{
            const{id,currentPassword,newPassword,confirmPassword}=req.body;

            try{
                const user=await User.findOne({_id:id});

                if(!user){
                    return res.json({status:"error",message:"User not found"});
                }
                if(!(await bcrypt.compare(currentPassword,user.password))){
                    return res.json({status:"error",message:"Invalid current password"});
                }
                if(newPassword!==confirmPassword){
                    return res.json({status:"error",message:"New password and confirm password do not match"})
                }

                const encryptedPassword=await bcrypt.hash(newPassword,10);

                await User.updateOne(
                    {_id:id},
                    {
                        $set:{
                            password:encryptedPassword,
                        },
                    }
                );
                res.json({status:"ok",message:"Password changed successfully"});
            }catch(error){
                res.json({status:"Error",message:"Error Changing Password"})
            }
        };


    exports.StudentRegister = StudentRegister;
    exports.MentorRegister = MentorRegister;
    exports.LoginUser = LoginUser;
    exports.UserData = UserData;
    exports.ForgetPassword = ForgetPassword;
    exports.ResetPasswordBeforeSubmit = ResetPasswordBeforeSubmit;
    exports.ResetPasswordAfterSubmit = ResetPasswordAfterSubmit;
    exports.UpdateProfile=UpdateProfile;
    exports.UploadPhoto=UploadPhoto;
    exports.DeletePhoto=DeletePhoto;
    exports.ChangePassword=ChangePassword;
