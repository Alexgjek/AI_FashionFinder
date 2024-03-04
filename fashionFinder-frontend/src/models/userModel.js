import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  albumName: String,
  outfits: Array
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true
  },
  firstName: {
    type: String,
    required: [true, "Please provide your first name"]
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"]
  },
  resetToken: String,
  resetTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  active: {
    type: Boolean,
    default: false
  },
  activatedAt: {
    type: Date,
    default: Date.now
  },
  albums: [albumSchema],
  brands: [String],
  budget: Number,
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
