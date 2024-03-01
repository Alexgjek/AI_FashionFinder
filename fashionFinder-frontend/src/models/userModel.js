import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  albumName: String,
  outfits: Array
}, {_id: false});
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
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  verifyToken: String,
  verifyTokenExpire: Date,
  albums: [albumSchema]
})

const User = mongoose.models.users || mongoose.model
("users", userSchema);

export default User;