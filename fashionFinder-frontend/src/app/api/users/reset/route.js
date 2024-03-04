import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";


export const POST = async (request) => {
    const {password,email} = await request.json();

    await connect();

    const existingUser = await User.findOne({email});
    const hashedPassword= await bcrypt.hash(password,5);

    existingUser.password=hashedPassword;
    existingUser.resetToken=undefined;
    existingUser.resetTokenExpiry=undefined;

    try{
        await existingUser.save();
        return new NextResponse("User's password is updated", {status:200});
    }
    catch(error){
        return new NextResponse(error,{status:500});
    }
};