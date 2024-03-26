import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";


export const POST = async (request) => {
  const { email } = await request.json();


  await connect();


  const existingUser = await User.findOne({ email });


  if (!existingUser) {
    return new NextResponse("Email doesn't exist.", { status: 400 });
  }


  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


  const passwordResetExpires = Date.now() + 360000;


  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;


  const resetUrl = `http://localhost:3000/reset/${resetToken}`;
  const body = `Reset Password by clicking the link, you have 6 min to reset before the link expires: ${resetUrl} \nThank you from the AI FashionFinder team.`;
  console.log(resetUrl);


  const msg = {
    to: email,
    from: "aifashionfinder@gmail.com",
    subject: "Reset Password",
    text: body,
  };
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");


  sgMail
    .send(msg)
    .then(() => {
      return new NextResponse("Reset password email is sent.", { status: 200 });
    })
    .catch(async (error) => {
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpiry = undefined;
      await existingUser.save();


      return new NextResponse("Failed sending email. Try again", {
        status: 400,
      });
    });
  try {
    await existingUser.save();
    return new NextResponse("Email is sent for resetting password", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(error, {
      status: 500,
    });
  }
};

