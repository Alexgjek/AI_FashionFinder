import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function PUT(request){
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';

  try {
    const reqBody = await request.json();
    let { oldName, newName } = reqBody; 
    console.log('oldName:', oldName, 'newName:', newName, 'email:', email, 'reqBody:', reqBody);
    const lowercasedEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercasedEmail });

    oldName = oldName.trim();
    newName = newName.trim();

    if (!newName) {
      return NextResponse.json({ error: "New album name cannot be empty" }, { status: 400 });
    }

    const existingAlbum = user.albums.find(album => album.albumName.trim().toLowerCase() === newName.toLowerCase());
    if (existingAlbum) {
      return NextResponse.json({ error: "Album already exists" }, { status: 400 });
    }

    newName = newName.trim();

    const updatedAlbum = await User.findOneAndUpdate(
      { email: lowercasedEmail, "albums.albumName": oldName }, 
      { $set: { "albums.$.albumName": newName } }, 
      { new: true } 
    );

    return NextResponse.json({ success: true, album: updatedAlbum });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
