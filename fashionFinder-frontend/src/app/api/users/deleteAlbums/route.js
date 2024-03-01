
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
  const albumName = searchParams.get('albumName');
  console.log(albumName);

  try {
    const userEmail = email.toLowerCase();

    if (!userEmail || !albumName) {
      return NextResponse.json({ error: "Email or albumName not provided" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { albums: { albumName: albumName } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
/*
    if (!user.albums.find(album => album.albumName === albumName)) {
      return NextResponse.json({ error: "Album not found in user's albums" }, { status: 404 });
    }
*/
    return NextResponse.json({ success: true, message: "Album deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
