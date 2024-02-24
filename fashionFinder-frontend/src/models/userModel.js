import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, "Please provide an email"],
    unique: true
  },
  firstName:{
    type:String,
    required: [true, "Please provide your first name"]
  },
  lastName:{
    type:String,
    required: [true, "Please provide your last name"]
  },
  password:{
    type:String,
    required:[true, "Please provide a password"]
  },
  resetToken:
  {
    type: String,
    required:false,
  },
  resetTokenExpiry:
  {
    type: Date,
    required:false,
  },
  verifyToken:
  {
    type: String,
    required:false,
  },
  verifyTokenExpiry:
  {
    type: Date,
    required:false,
  },
  active:{
    Boolean:false,
  },
  activatedAt: {
    type: Date,
    default: Date.now 
  },
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  active:Boolean,
  activatedAt:Date,
})

const User = mongoose.models.users || mongoose.model
("users", userSchema);

export default User;