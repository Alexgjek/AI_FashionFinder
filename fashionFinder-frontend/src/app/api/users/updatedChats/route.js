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

    // Find the user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the chat by chatName
    const chatIndex = user.savedChats.findIndex(chat => chat.chatName === chatName);

    if (chatIndex === -1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Update the messages of the chat
    user.savedChats[chatIndex].messages = messages;
    // No need to create a new document, just save the existing user document
    await user.save();

    return NextResponse.json({ success: true, message: "Chat updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}