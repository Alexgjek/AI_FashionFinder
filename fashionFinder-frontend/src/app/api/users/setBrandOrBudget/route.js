import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';
 
  try {
    const lowercasedEmail = email.toLowerCase();
    const reqBody = await request.json();
    const { brands, budget } = reqBody;
    
    const user = await User.findOne({ email: lowercasedEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!Array.isArray(brands)) {
      return NextResponse.json({ error: "Brands should be an array" }, { status: 400 });
    }

    const existingBrands = user.brands;
    const newBrands = brands.filter(brand => !existingBrands.includes(brand));

    for (const newBrand of newBrands) {
      if (existingBrands.includes(newBrand)) {
        return NextResponse.json({ error: `Brand '${newBrand}' already exists for this user` }, { status: 409 });
      }
    }

    user.brands.push(...newBrands);

    if (budget) {
      user.budget = budget;
    }

    await user.save();

    return NextResponse.json({ message: "Brands and budget updated successfully", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}