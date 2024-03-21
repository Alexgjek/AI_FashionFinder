import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function DELETE(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';

  try {
    const userEmail = email.toLowerCase();
    const searchParams = request.nextUrl.searchParams;
    const chatName = searchParams.get('chatName');

    if (!userEmail || !chatName) {
      return NextResponse.json({ error: "Email or chatName not provided" }, { status: 400 });
    }

    // Update the logic to remove the chat from the database
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { savedChats: { chatName: chatName } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}