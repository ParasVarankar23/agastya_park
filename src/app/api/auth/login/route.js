import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import { comparePassword } from "@/utils/hashPassword";

import {
    generateAccessToken,
    generateRefreshToken,
} from "@/utils/jwt";

import {
    validateEmail,
    validateRequiredFields,
} from "@/utils/validations";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { email, password } = body;

        // Required Validation
        const validation =
            validateRequiredFields(body, [
                "email",
                "password",
            ]);

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
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

        // Find User
        const user =
            await User.findOne({
                email: email.toLowerCase(),
            });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid email or password.",
                },
                {
                    status: 401,
                }
            );
        }

        // Check User Status
        if (user.status !== "active") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Your account has been deactivated.",
                },
                {
                    status: 403,
                }
            );
        }

        // Compare Password
        const isMatch =
            await comparePassword(
                password,
                user.password
            );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid email or password.",
                },
                {
                    status: 401,
                }
            );
        }

        // Generate Tokens
        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        return NextResponse.json(
            {
                success: true,
                message:
                    "Login successful.",

                accessToken,

                refreshToken,

                user: {
                    id: user._id,

                    name: user.name,

                    email: user.email,

                    role: user.role,

                    profileImage:
                        user.profileImage,
                },
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
                    "Something went wrong.",
            },
            {
                status: 500,
            }
        );
    }
}