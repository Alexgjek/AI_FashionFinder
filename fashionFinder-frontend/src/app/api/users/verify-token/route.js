import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";


export const POST = async (request) => {
    const {token} =await request.json();

    await connect();

    const hashedToken= crypto.createHash("sha256").update(token).digest("hex");

    const user =await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiry:{ $gt:Date.now()}
    })
    if(!user){
        return new NextResponse("Invalid token or has expired", {status:400});
    }
    return new NextResponse(JSON.stringify(user),{status:200});
};