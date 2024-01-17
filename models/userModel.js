const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
    {
        fname: {type:String,required:String},
        lname: {type:String,required:String},
        email: {type:String,unique:true,required:String},
        password: {type:String,required:String},
        usertype: {type:String,required:String},
        scnumber: {type:String,required:function(){
            return this.usertype === 'Student';
        }},
        mentorid: {type:String,required:function(){
            return this.usertype === 'Mentor';
        }},
    },
    {
        collection:"UserInfo",
    }
    );

const User = mongoose.model("UserInfo",UserDetailsSchema);

module.exports = User;