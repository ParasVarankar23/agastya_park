import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import {
    validateEmail,
    validateRequiredFields,
} from "@/utils/validations";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { email, otp } = body;

        // Required Validation
        const validation = validateRequiredFields(
            body,
            ["email", "otp"]
        );

        if (!validation.success) {
            return NextResponse.json(validation, {
                status: 400,
            });
        }

        // Email Validation
        if (!validateEmail(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a valid email address.",
                },
                {
                    status: 400,
                }
            );
        }

        // Find User
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // OTP Exists
        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "OTP not found. Please request a new OTP.",
                },
                {
                    status: 400,
                }
            );
        }

        // OTP Expired
        if (new Date() > user.otpExpiry) {
            user.otp = null;
            user.otpExpiry = null;

            await user.save();

            return NextResponse.json(
                {
                    success: false,
                    message: "OTP has expired. Please request a new OTP.",
                },
                {
                    status: 400,
                }
            );
        }

        // OTP Match
        if (user.otp !== otp) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OTP.",
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "OTP verified successfully.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}