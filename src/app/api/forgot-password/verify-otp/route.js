import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";

export async function POST(req) {
    try {
        await connectDB();

        const { email, otp } =
            await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and OTP are required",
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

        console.log("Stored OTP:", user.otp);
        console.log("Entered OTP:", otp);

        if (
            String(user.otp) !==
            String(otp)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OTP",
                    enteredOtp: otp,
                    storedOtp: user.otp,
                },
                { status: 400 }
            );
        }

        if (
            !user.otpExpiry ||
            user.otpExpiry < new Date()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "OTP Expired",
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "OTP Verified Successfully",
        });
    } catch (error) {
        console.error(
            "Verify OTP Error:",
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