import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (request) => {
    const { token } = await request.json();

    await connect();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        verifyToken: hashedToken,
        verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return new NextResponse("Invalid token or has expired", { status: 400 });
    }
    user.active = true;
    user.activatedAt = new Date();
    await user.save();

    return new NextResponse(JSON.stringify(user), { status: 200 });
};