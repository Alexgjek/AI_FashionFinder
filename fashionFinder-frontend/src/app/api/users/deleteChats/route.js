import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function DELETE(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';
  
  const searchParams = request.nextUrl.searchParams;
  const chatId = searchParams.get('chatId'); // Update to use chatId instead of chatName
  console.log(chatId);

  try {
    const userEmail = email.toLowerCase();

    if (!userEmail || !chatId) {
      return NextResponse.json({ error: "Email or chatId not provided" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { savedChats: { _id: chatId } } }, // Modify the query to delete by chat_id
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