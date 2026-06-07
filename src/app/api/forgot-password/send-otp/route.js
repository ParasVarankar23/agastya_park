import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { sendOTPEmail } from "@/utils/sendEmail";

export async function POST(req) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is required",
                },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        console.log("Generated OTP:", otp);

        // Save OTP
        user.otp = otp;

        user.otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await user.save();

        // Verify Saved Data
        const updatedUser = await User.findById(
            user._id
        );

        console.log("Saved OTP:", updatedUser.otp);
        console.log(
            "Saved OTP Expiry:",
            updatedUser.otpExpiry
        );

        // Send Email
        await sendOTPEmail(
            user.email,
            user.name,
            otp
        );

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error(
            "Send OTP Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}