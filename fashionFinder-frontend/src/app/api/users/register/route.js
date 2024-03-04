import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect(); // Connect to the database

 //Function to delete inactive users
 async function deleteInactiveUsers() {
   try {
     const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000);
     const inactiveUsers = await User.find({
       activatedAt: { $exists: false } // Users without activatedAt attribute
     });

     // Filter out users whose activatedAt is older than 6 minutes
     const usersToDelete = inactiveUsers.filter(user => !user.activatedAt || user.activatedAt < sixMinutesAgo);

     await Promise.all(
       usersToDelete.map(async (user) => {
         await User.findByIdAndDelete(user._id);
       })
     );

     console.log(`Deleted ${usersToDelete.length} inactive users`);
   } catch (error) {
     console.error('Error deleting inactive users:', error);
   }
 }
export async function POST(request) {
  try {
    const reqBody = await request.json()
    const {email, firstName, lastName, password, confirmPassword} = reqBody

    console.log(reqBody);

    const user = await User.findOne({ email: email.toLowerCase()})
    if (user){
      return NextResponse.json({error: "User already exists"}, {status: 400})
    }

  
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 505 });
    }

   
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    //check if password meets requirements
    
    if (!passwordRequirements) {
      return NextResponse.json({ error: "Password must be at least 8 characters, contain at least 1 uppercase letter and at least 1 number" }, { status: 403 });
    }

   
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 402 });
    }

    
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 300 });
    }

    
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      active: false 
    });


    const savedUser = await newUser.save()
    console.log(savedUser);


    setInterval(deleteInactiveUsers, 360000); 
    
    return NextResponse.json({
      message: "User created succesfully",
      success: true,
      savedUser
    })
  
  } catch (error) {
    console.error(error); 

    return NextResponse.json({error: error.message}, {status:500})
  }
}