import { connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function GET(request) {
    const token = request.cookies.get("token")?.value || '';
    console.log('Token:', token);
    const decodedToken = jwt.decode(token);
    const email = decodedToken ? decodedToken.email : '';
    console.log('Decoded Email:', email); 

  try {
    
    const user = await User.findOne({ email: email });

    if (!email){
      console.log('No email');
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log('found:', user.email);
    return NextResponse.json({ 
      email: user.email
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}