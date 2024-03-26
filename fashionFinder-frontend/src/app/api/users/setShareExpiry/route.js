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
    const { shareToken } = reqBody;

    const decodedShareToken = jwt.verify(shareToken, process.env.TOKEN_SECRET);
    const { email /*: shareEmail*/, albumName } = decodedShareToken;

  
    // if (shareEmail !== email) {
    //   return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    // }

    const user = await User.findOne({ email });


    const album = user.albums.find(album => album.albumName === albumName);

    album.timesOpened += 1;
    album.shareExpiry = Date.now() + 360000;

    await user.save();
    console.log('sfndd', album.shareExpiry) 
    console.log('times opened:', album.timesOpened)
    return NextResponse.json({
      message: 'Share expiry set successfully',
      shareExpiry: album.shareExpiry,
      timesOpened: album.timesOpened
    });
    
  } catch (error) {
    console.error('Error setting share expiry:', error);
    return NextResponse.json({ error: "Failed to set share expir" }, { status: 500 });

  }
}
