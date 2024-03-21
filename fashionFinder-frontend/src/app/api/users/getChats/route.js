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
      const lowercasedEmail = email.toLowerCase();
      const user = await User.findOne({ email: lowercasedEmail });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      const savedChats = user.savedChats || [];
  
      return NextResponse.json({ savedChats });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }