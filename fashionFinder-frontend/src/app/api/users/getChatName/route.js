import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function GET(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';
  const { chatName } = request.query;

  try {
    const userEmail = email.toLowerCase();

    if (!userEmail || !chatName) {
      return NextResponse.json({ error: "Email or chatName not provided" }, { status: 400 });
    }

    // Retrieve the chat name from the database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the saved chat with the matching chat name
    const savedChat = user.savedChats.find(chat => chat.chatName === chatName);

    if (!savedChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chatName });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}