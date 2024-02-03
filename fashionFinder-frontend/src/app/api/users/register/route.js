import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect() // connencting to the database

export async function POST(request) {
  try {
    const reqBody = await request.json()
    const {email, firstName, lastName, password} = reqBody

    console.log(reqBody);

    //check if user exists
    const user = await User.findOne({email})

    if (user){
      return NextResponse.json({error: "User already exists"}, {status: 400})
    }

    //hashing password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    console.log(savedUser);

    return NextResponse.json({
      message: "User created succesfully",
      success: true,
      savedUser
    })
    


  } catch (error) {
    return NextResponse.json({error: error.message}, {status:500})
  }
}