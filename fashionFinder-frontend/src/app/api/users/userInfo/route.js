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
      const userEmail = email
  
      if (!userEmail) {
        return NextResponse.json({ error: "No email" }, { status: 400 });
      }
  
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const responseObj = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      if (user.brands){
        responseObj.brands = user.brands;
      }
      if (user.budget){
        responseObj.budget = user.budget;
      }
  
      return NextResponse.json({ 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        brands: user.brands,
        budget: user.budget
      });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }