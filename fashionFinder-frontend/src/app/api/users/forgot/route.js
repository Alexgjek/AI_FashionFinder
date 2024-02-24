import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";


export const POST = async (request) => {
    const {email} =await request.json();

    await connect();

    const existingUser =await User.findOne({email});

    if(!existingUser){
        return new NextResponse("Email doesn't exist.",{status:400})
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    const passwordResetExpires= Date.now()+360000;

    existingUser.resetToken=passwordResetToken;
    existingUser.resetTokenExpiry=passwordResetExpires;
   
    const resetUrl = `http://localhost:3000/reset/${resetToken}`;
    const body = `Reset Password by clicking here, you have 6 min to verify before the link expires"${resetUrl} ${resetUrl}`;
    console.log(resetUrl);


    const msg={
        to:email,
        from:"aifashionfinder@gmail.com",
        subject:"Reset Password",
        text:body
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

    sgMail.send(msg).then(() => {
        return new NextResponse("Reset password email is sent.", {status:200});
    }).catch(async(error)=>{
        existingUser.resetToken= undefined;
        existingUser.resetTokenExpiry=undefined;
        await existingUser.save();
    
        return new NextResponse("Failed sending email. Try again", {
            status:400,
        });
    });
    try{
        await existingUser.save();
        return new NextResponse("Email is sent for resetting password", {
            status:200,
        });
    }catch(error){
        return new NextResponse(error, {
            status:500,
    });
    }
};


// connect() // connencting to the database

// export async function POST(request) {
//   try {
//     const reqBody = await request.json()
//     const {email, firstName, lastName, password, confirmPassword} = reqBody

//     console.log(reqBody);

//     //check if user exists
//     const user = await User.findOne({ email: email.toLowerCase()})
//     if (user){
//       return NextResponse.json({error: "User already exists"}, {status: 400})
//     }

//     //check if all fields are present
//     if (!email || !firstName || !lastName || !password || !confirmPassword) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 505 });
//     }

//     //check if password meets requirements
//     const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
//     if (!passwordRequirements) {
//       return NextResponse.json({ error: "Password must be at least 8 characters, contain at least 1 uppercase letter and at least 1 number" }, { status: 403 });
//     }

//     //check if password and confirmPassword match
//     if (password !== confirmPassword) {
//       return NextResponse.json({ error: "Passwords do not match" }, { status: 402 });
//     }

//     //check if valid email format
//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     if (!isValidEmail) {
//       return NextResponse.json({ error: "Invalid email format" }, { status: 300 });
//     }

//     //hashing password
//     const salt = await bcryptjs.genSalt(10)
//     const hashedPassword = await bcryptjs.hash(password, salt)

//     const newUser = new User({
//       email: email.toLowerCase(),
//       firstName,
//       lastName,
//       password: hashedPassword
//     })

//     const savedUser = await newUser.save()
//     console.log(savedUser);

//     // //send email to user to verify email
    
//     console.log("Sending email...");

//     await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
//     console.log("Email sent.");
    
//     return NextResponse.json({
//       message: "User created succesfully",
//       success: true,
//       savedUser
//     })
  


//   } catch (error) {
//     console.error(error); // Log the error to the console

//     return NextResponse.json({error: error.message}, {status:500})
//   }
// }