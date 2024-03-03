import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';
 
  try {
    const lowercasedEmail = email.toLowerCase();
    const reqBody = await request.json();
    console.log(reqBody);
    const { brands, budget } = reqBody;
    
    const user = await User.findOne({ email: lowercasedEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (Array.isArray(brands)) {
      brands.forEach(newBrand => {
        if (!user.brands.includes(newBrand)) {
          user.brands.push(newBrand);
        }
      });
    } else if (brands) {
      return NextResponse.json({ error: "Brands should be an array" }, { status: 400 });
    }

    if (budget) {
      user.budget = budget;
    }

    await user.save();

    return NextResponse.json({ message: "Brands and budget updated successfully", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
