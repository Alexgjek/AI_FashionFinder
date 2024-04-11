import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import queryString from "query-string";

connect();

export async function GET(request) {
  const token = request.cookies.get("token")?.value || "";
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : "";
  console.log("Search Params:", request.nextUrl.searchParams);

  try {
    let userEmail = email;

    const shareToken = request.nextUrl.searchParams.get("token");
    if (shareToken) {
      const decodedShareToken = jwt.decode(shareToken);
      userEmail = decodedShareToken ? decodedShareToken.email : "";
    }

    if (!userEmail) {
      console.log("No email found");
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    const user = await User.findOne({ email: userEmail });

    console.log("User:", user);

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const albumNameEncoded = request.nextUrl.searchParams.get("albumName");
    const albumName = decodeURIComponent(albumNameEncoded);

    console.log("Album name:", albumName);

    if (!albumName) {
      console.log("No albumName provided");
      return NextResponse.json(
        { error: "No albumName provided" },
        { status: 400 }
      );
    }

    const album = user.albums.find((album) => album.albumName === albumName);

    console.log("Album:", album);

    if (!album) {
      console.log(`Album "${albumName}" not found for user "${userEmail}"`);
      return NextResponse.json(
        { error: `Album "${albumName}" not found for user "${userEmail}"` },
        { status: 404 }
      );
    }

    console.log("Outfits:", album.outfits);

    let filteredOutfits = album.outfits;
    console.log("Filtered outfits:", filteredOutfits);

    const filters = request.nextUrl.searchParams.getAll("filters[]");

    console.log("Filters:", filters);

    const brands = [
      ...new Set(
        filteredOutfits.map((outfit) => outfit.brand.trim().toLowerCase())
      ),
    ];
    const colors = [
      ...new Set(
        filteredOutfits.flatMap((outfit) => {
          if (outfit.color) {
            return Array.isArray(outfit.color)
              ? outfit.color.map((color) => color.trim().toLowerCase())
              : outfit.color
                  .split(",")
                  .map((color) => color.trim().toLowerCase());
          }
          return [];
        })
      ),
    ];

    if (filters.length > 0) {
      const brandFilters = filters.filter((filter) =>
        brands.includes(filter.trim().toLowerCase())
      );
      console.log("Brand filters:", brandFilters);
      const colorFilters = filters.filter(
        (filter) => !brands.includes(filter.trim().toLowerCase()) && isNaN(parseFloat(filter))
      );
      console.log("Color filters:", colorFilters);
      const lowerBoundFilter = filters.find(
        (filter) => !brands.includes(filter.trim().toLowerCase()) && !isNaN(parseFloat(filter))
      );
      
      console.log("Lower bound filter:", lowerBoundFilter);
      
      const upperBoundFilter = filters.find(
        (filter) => !brands.includes(filter.trim().toLowerCase()) && !isNaN(parseFloat(filter)) && filter !== lowerBoundFilter
      );

      console.log("Upper bound filter:", upperBoundFilter);

      filteredOutfits = filteredOutfits.filter((outfit) => {
        const outfitColors = outfit.color
          ? Array.isArray(outfit.color)
            ? outfit.color
            : outfit.color.split(",").map((color) => color.trim().toLowerCase())
          : [];
        const outfitBrand = outfit.brand
          ? outfit.brand.trim().toLowerCase()
          : "";
      
        const matchesBrandFilter = brandFilters.length === 0 || brandFilters.some(
          (filter) => outfitBrand === filter.trim().toLowerCase()
        );
        const matchesColorFilter = colorFilters.length === 0 || colorFilters.some((filter) =>
          outfitColors.includes(filter.trim().toLowerCase())
        );
      
        const withinPriceRange = !isNaN(parseFloat(lowerBoundFilter)) && !isNaN(parseFloat(upperBoundFilter))
          ? outfit.price
            ? parseFloat(outfit.price.replace(/[^0-9.-]+/g, "")) >= parseFloat(lowerBoundFilter) &&
              parseFloat(outfit.price.replace(/[^0-9.-]+/g, "")) <= parseFloat(upperBoundFilter)
            : false
          : true;
      
        return matchesBrandFilter && matchesColorFilter && withinPriceRange;
      });      
    }

    return NextResponse.json({ outfits: filteredOutfits });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
