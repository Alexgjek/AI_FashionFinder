import mongoose from "mongoose";

import {userSchema} from "./userModel";

const reviewSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"]
  },
  comment: {
    type: String,
    required: false
  }
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

Review.createCollection()

export default Review;
