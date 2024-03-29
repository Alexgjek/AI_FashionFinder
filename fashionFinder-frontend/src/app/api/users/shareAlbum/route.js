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
    let { albumName } = reqBody;
    const lowercasedEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercasedEmail });

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const album = user.albums.find(album => album.albumName === albumName);

    if (!album) {
      console.log('Album not found');
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.shareExpiry) {
      album.shareExpiry = null; 
    }

    if (album.timesOpened >= 1) {
      album.timesOpened = 0;
    }

    const shareToken = jwt.sign({ email, albumName }, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    album.shareToken = shareToken;

    await user.save();

    console.log('Share token:', shareToken);

    return NextResponse.json({ shareToken, user });

  } catch (error) {
    console.error('Error sharing album:', error);
    return NextResponse.json({ error: "Failed to share album" }, { status: 500 });
  }
}
