import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { hashPassword } from "@/utils/hashPassword";

export async function POST(req) {
    try {
        await connectDB();

        const {
            email,
            otp,
            newPassword,
            confirmPassword,
        } = await req.json();

        if (
            newPassword !== confirmPassword
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Passwords do not match",
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

        if (user.otp !== otp) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OTP",
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

        const hashedPassword =
            await hashPassword(
                newPassword
            );

        user.password =
            hashedPassword;

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return NextResponse.json({
            success: true,
            message:
                "Password updated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}