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
    reqBody.email = email;
    const { albumName } = reqBody;
    const lowercasedEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercasedEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!albumName.trim()) {
      return NextResponse.json({ error: "Album name cannot be empty" }, { status: 400 });
    }

    const existingAlbum = user.albums.find(album => album.albumName.toLowerCase() === albumName.toLowerCase());
    if (existingAlbum) {
      return NextResponse.json({ error: "Album already exists" }, { status: 400 });
    }

    user.albums.push({ albumName, outfits: [] });
    await user.save();

    return NextResponse.json({ message: "Album created successfully", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
