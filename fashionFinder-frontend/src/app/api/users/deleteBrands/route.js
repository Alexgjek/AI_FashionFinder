import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function DELETE(request){
  const token = request.cookies.get("token")?.value || '';
  const decodedToken = jwt.decode(token);
  const email = decodedToken ? decodedToken.email : '';

  const searchParams = request.nextUrl.searchParams;
  const brand = searchParams.get('brand');
  console.log(brand);

  try {
    const userEmail = email.toLowerCase();

    if (!userEmail || !brand) {
      return NextResponse.json({ error: "Email or brand not provided" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { brands: brand } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}