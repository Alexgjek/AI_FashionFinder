import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function GET(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';

  try {
    let userEmail = email;

    const shareToken = request.nextUrl.searchParams.get('token');
    if (shareToken) {
      const decodedShareToken = jwt.decode(shareToken);
      userEmail = decodedShareToken ? decodedShareToken.email : '';
    }

    if (!userEmail) {
      console.log('No email found');
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    const user = await User.findOne({ email: userEmail });

    console.log('User:', user);

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const albumNameEncoded = request.nextUrl.searchParams.get('albumName');
    const albumName = decodeURIComponent(albumNameEncoded); 

    console.log('Album name:', albumName);

    if (!albumName) {
      console.log('No albumName provided');
      return NextResponse.json({ error: "No albumName provided" }, { status: 400 });
    }

    const album = user.albums.find((album) => album.albumName === albumName);

    console.log('Album:', album);

    if (!album) {
      console.log(`Album "${albumName}" not found for user "${userEmail}"`);
      return NextResponse.json({ error: `Album "${albumName}" not found for user "${userEmail}"` }, { status: 404 });
    }

    console.log('Outfits:', album.outfits);
    
    return NextResponse.json({ outfits: album.outfits });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
