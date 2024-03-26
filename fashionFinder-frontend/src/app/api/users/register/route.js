import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect(); // Connect to the database


export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, firstName, lastName, password, confirmPassword } = reqBody;


    console.log(reqBody);


    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }


    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 505 });
    }


    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(password);
    if (!passwordRequirements) {
      return NextResponse.json({ error: "Password must be at least 8 characters, contain at least 1 uppercase letter, at least 1 number, and may include special characters" }, { status: 403 });
    }


    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 402 });
    }


    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 300 });
    }


    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);


    const newUser = new User({
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      active: false
    });


    const savedUser = await newUser.save();


    // Check if the user has become active after six minutes
    setTimeout(async () => {
      const userAfterSixMinutes = await User.findOne({ _id: savedUser._id });
      if (!userAfterSixMinutes.active) {
        await User.deleteOne({ _id: savedUser._id });
        console.log("User account deleted due to inactivity");
      }
    }, 6 * 60 * 1000); // 6 minutes in milliseconds


    console.log(savedUser);


    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser
    });


  } catch (error) {
    console.error(error);


    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
