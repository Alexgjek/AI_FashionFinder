import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function PUT(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';

  try {
    const userEmail = email.toLowerCase();
    const { chatName, messages } = await request.json();

    if (!userEmail || !chatName || !messages) {
      return NextResponse.json({ error: "Email, chatName, or messages not provided" }, { status: 400 });
    }

    // Update the logic to find the user and update the chat with new messages
    const user = await User.findOneAndUpdate(
      { email: userEmail, "savedChats.chatName": chatName }, // Find user by email and chatName
      { $set: { "savedChats.$.messages": messages } }, // Update the messages array for the matched chat
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User or chat not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Chat updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}