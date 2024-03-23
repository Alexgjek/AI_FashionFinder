import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (request) => {
    try {
        const { token } = await request.json();

        await connect();

        // Hash the token received in the request
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find the user with the matching hashed token and valid expiry
        const user = await User.findOne({
            verifyToken: hashedToken,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return new NextResponse("Invalid token or has expired", { status: 400 });
        }

        // Set user as active and update activatedAt
        user.active = true;
        user.activatedAt = new Date();

        // Save changes to the user document in the database
        await user.save();

        // Return a success response with the updated user information
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error activating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
