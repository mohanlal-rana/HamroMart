const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const tempUserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    otp:{
        type:String,
        required:true
    },
    otpExpires:{
        type:Date,
        required:true
    }   
})
const TempUser=mongoose.model("TempUser",tempUserSchema)
module.exports=TempUser