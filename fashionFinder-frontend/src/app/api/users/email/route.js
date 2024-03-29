import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

export const POST = async (request) => {
    const {email} =await request.json();

    await connect();

    const existingUser =await User.findOne({email});

    if(!existingUser){
        return new NextResponse("Email doesn't exist.",{status:400})
    }

    const Token = crypto.randomBytes(20).toString('hex');
    const verifyToken = crypto
    .createHash("sha256")
    .update(Token)
    .digest("hex");

    const verifyTokenExpires= Date.now()+360000;

    existingUser.verifyToken=verifyToken;
    existingUser.verifyTokenExpiry=verifyTokenExpires;
   
    const verifyUrl = `http://localhost:3000/successPage/${Token}`;
    const body = `Verify Email by clicking this link, you have 6 min to verify before the link expires: "${verifyUrl} \nThank you from the AI FashionFinder team.`;
    console.log(verifyUrl);


    const msg={
        to:email,
        from:"aifashionfinder@gmail.com",
        subject:"Verify Email",
        text:body
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

    sgMail.send(msg).then(() => {
        return new NextResponse("Verify email is sent.", {status:200});
    }).catch(async(error)=>{
        existingUser.verifyToken= undefined;
        existingUser.verifyTokenExpiry=undefined;
        await existingUser.save();
    
        return new NextResponse("Failed sending email. Try again", {
            status:400,
        });
    });
    try{
        await existingUser.save();
        return new NextResponse("Email is sent for verifying email", {
            status:200,
        });
    }catch(error){
        return new NextResponse(error, {
            status:500,
    });
    }
};
