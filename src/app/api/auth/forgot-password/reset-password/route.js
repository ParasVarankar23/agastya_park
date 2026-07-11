import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import { hashPassword } from "@/utils/hashPassword";

import {
    validateEmail,
    validatePassword,
    validateRequiredFields,
} from "@/utils/validations";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            email,
            otp,
            password,
            confirmPassword,
        } = body;

        // Required Validation
        const validation =
            validateRequiredFields(body, [
                "email",
                "otp",
                "password",
                "confirmPassword",
            ]);

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
                    message:
                        "Please enter a valid email address.",
                },
                {
                    status: 400,
                }
            );
        }

        // Password Length
        if (!validatePassword(password)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must be at least 8 characters.",
                },
                {
                    status: 400,
                }
            );
        }

        // Confirm Password
        if (password !== confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password and Confirm Password do not match.",
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
                    message:
                        "Please request a new OTP.",
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
                    message:
                        "OTP has expired.",
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

        // Hash Password
        const hashedPassword =
            await hashPassword(password);

        // Update Password
        user.password = hashedPassword;

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Password reset successfully.",
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