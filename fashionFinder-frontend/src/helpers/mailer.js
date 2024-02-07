import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async({email, emailType, userId}) => {
  try {
    //create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY"){
      await User.findByIdAndUpdate(userId,
        {verifyToken: hashedToken, verifyTokenExpire: Date.now() + 3600000});
    } else if (emailType === 'RESET'){
      await User.findByIdAndUpdate(userId,
        {forgotPasswordToken: hashedToken, forgotPasswordExpire: Date.now() + 3600000});
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "beca56d8babcc0",
        pass: "13246e99570ddf"
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`
    }

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;

  } catch (error) {
    throw new Error(error.message)
  }
}

