import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function GET(request) {
    const token = request.cookies.get("token")?.value || '';
    const decodedToken = jwt.decode(token);
    const email = decodedToken ? decodedToken.email : '';
 
    try {
      const userEmail = email
 
      if (!userEmail) {
        return NextResponse.json({ error: "No email" }, { status: 400 });
      }
 
      const user = await User.findOne({ email: userEmail });
 
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        email: user.email,
      });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }