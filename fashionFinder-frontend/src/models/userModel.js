import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  link: Boolean,
  action: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const albumSchema = new mongoose.Schema({
  albumName: String,
  outfits: Array,
  dateCreated: {
    type: Date,
    default: Date.now
  },
  shareToken: String,
  shareExpiry: Date,
  timesOpened:{
    type: Number,
    default: 0
  }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  chatId: mongoose.Schema.Types.ObjectId, 
  chatName: String,
  messages: [messageSchema]
}, { timestamps: true });

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
  },
  albums: [albumSchema],
  savedChats: [chatSchema],
  brands: [String],
  budget: Number,
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;