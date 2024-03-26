import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  const token = request.cookies.get("token")?.value || "";
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : "";

  const { selectedAlbums, outfits } = await request.json();

  console.log("Selected albums:", selectedAlbums);
  console.log("Outfits:", outfits);
  
  try {
    const user = await User.findOne({ email });

    for (const albumName of selectedAlbums) {
      const album = user.albums.find((album) => album.albumName === albumName);

      if (album) {
        outfits.forEach(({ outfitUrl, imageUrl, price, color, brand, rating }) => {
          const outfitExists = album.outfits.some((outfit) => outfit.outfitUrl === outfitUrl && outfit.imageUrl === imageUrl);
          if (!outfitExists) {
            album.outfits.push({ outfitUrl, imageUrl,price, color, brand, rating, dateAdded: Date.now()});
          }
        });
      } else {
        console.error(`Album "${albumName}" not found for user "${email}"`);
      }
    }

    await user.save();
    return NextResponse.json({
      message: "Outfits added to albums successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}