import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function DELETE(request) {
  try {
    console.log('Delete request received...');
    // Get user's email from JWT token
    const token = request.cookies.get("token")?.value || '';
    const decodedToken = jwt.decode(token);
    const email = decodedToken ? decodedToken.email : '';

    // Get the album name from the request URL
    const albumNameEncoded = request.nextUrl.searchParams.get('albumName');
    const albumName = decodeURIComponent(albumNameEncoded);
    
    console.log('User email:', email);
    console.log('Album name:', albumName);

    // Find the user
    const user = await User.findOne({ email: email });
    console.log('User:', user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the album
    const album = user.albums.find((album) => album.albumName === albumName);
    console.log('Album:', album);

    if (!album) {
      return NextResponse.json({ error: `Album "${albumName}" not found for user "${email}"` }, { status: 404 });
    }

    // Get the outfit URL to delete
    const outfitUrlToDelete = request.nextUrl.searchParams.get('outfitUrl');
    console.log('Outfit URL to delete:', outfitUrlToDelete);

    // Find the outfit index in the album's outfits array based on the outfit URL
    const outfitIndexToDelete = album.outfits.findIndex(outfit => outfit.outfitUrl === outfitUrlToDelete);

    console.log('Outfit index to delete:', outfitIndexToDelete);

    if (outfitIndexToDelete === -1) {
      return NextResponse.json({ error: "Outfit not found in the album" }, { status: 404 });
    }

    // Remove the outfit from the album's outfits array
    album.outfits.splice(outfitIndexToDelete, 1);

    // Save the changes to the user document
    await user.save();

    console.log('Outfit deleted successfully');
    return NextResponse.json({ message: "Outfit deleted successfully" });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

