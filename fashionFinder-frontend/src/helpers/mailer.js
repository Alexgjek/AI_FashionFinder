
// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";
// import crypto from "crypto";
// import sgMail from "@sendgrid/mail";

// export const POST = async (request) => {
//     const { email } = await request.json();

//     // Convert email to lowercase
//     const lowerCaseEmail = email.toLowerCase();

//     await connect();

//     const existingUser = await User.findOne({ email: lowerCaseEmail });

//     if (!existingUser) {
//         return new NextResponse("Email doesn't exist.", { status: 400 });
//     }

//     const resetToken = crypto.randomBytes(20).toString('hex');
//     const passwordResetToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");

//     const passwordResetExpires = Date.now() + 360000;

//     existingUser.resetToken = passwordResetToken;
//     existingUser.resetTokenExpiry = passwordResetExpires;

//     const resetUrl = `http://localhost:3000/verifyemail/${resetToken}`;
//     const body = `Verify email by clicking here"${resetUrl}`;
//     console.log(resetUrl);

//     const msg = {
//         to: email,
//         from: "aifashionfinder@gmail.com",
//         subject: "Verify Email",
//         text: body
//     };
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

//     sgMail.send(msg).then(() => {
//         return new NextResponse("Reset password email is sent.", { status: 200 });
//     }).catch(async (error) => {
//         existingUser.resetToken = undefined;
//         existingUser.resetTokenExpiry = undefined;
//         await existingUser.save();

//         return new NextResponse("Failed sending email. Try again", {
//             status: 400,
//         });
//     });
//     try {
//         await existingUser.save();
//         return new NextResponse("Email is sent for resetting password", {
//             status: 200,
//         });
//     } catch (error) {
//         return new NextResponse(error, {
//             status: 500,
//         });

//     }
// };






// import nodemailer from 'nodemailer';
// import User from "@/models/userModel";
// import bcryptjs from "bcryptjs";

// export const sendEmail = async({email, emailType, userId}) => {
//   try {
//     //create a hashed token
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     if (emailType === "VERIFY"){
//       await User.findByIdAndUpdate(userId,
//         {verifyToken: hashedToken, verifyTokenExpire: Date.now() + 3600000});
//     } else if (emailType === 'RESET'){
//       await User.findByIdAndUpdate(userId,
//         {forgotPasswordToken: hashedToken, forgotPasswordExpire: Date.now() + 3600000});
//     }

//     const transport = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: "beca56d8babcc0",
//         pass: "13246e99570ddf"
//       }
//     });

//     const mailOptions = {
//       from: "aifashionfinder@gmail.com",
//       to: email,
//       subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
//       html: `<p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY" ? "verify your email" : "reset your password"}
//       or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//       </p>`
//     }

//     const mailResponse = await transport.sendMail(mailOptions);
//     return mailResponse;

//   } catch (error) {
//     throw new Error(error.message)
//   }
// }

