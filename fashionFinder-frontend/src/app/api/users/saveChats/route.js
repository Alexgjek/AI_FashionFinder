import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';

  try {
    const reqBody = await request.json();
    const { chatName, messages } = reqBody; // Extracting chatName and messages from request body
    const lowercasedEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercasedEmail });

    console.log(JSON.stringify(messages))

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!chatName.trim()) {
      return NextResponse.json({ error: "Chat name cannot be empty" }, { status: 400 });
    }

    // Add the new chat to the user's savedChats
    user.savedChats.push({ chatName, messages });
    await user.save();

    return NextResponse.json({ message: "Chat saved successfully", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}