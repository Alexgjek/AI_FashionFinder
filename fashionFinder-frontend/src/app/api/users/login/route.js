import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request) {
  try{

    const reqBody= await request.json()
    const {email, password} = reqBody;
    console.log(reqBody)

    //check if the user exists
    const user = await User.findOne({email})
    if (!user){
      return NextResponse.json({error:"User does not exist"}, {status: 400})
    }

    //check if the password is correct
    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword){
      return NextResponse.json({error: "Invalid password"}, {status:400})
    }
    //create token data
    const tokenData = {
      id: user._id,
      email: user.email
    }
    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1hr"})

    const response = NextResponse.json({
      message: "Login successful",
      success: true
    })
    response.cookies.set("token", token, {
      httpOnly: true
    })
    return response;

  } catch (error){
    return NextResponse.json({error: error.message}, {status: 500})
  }
}



