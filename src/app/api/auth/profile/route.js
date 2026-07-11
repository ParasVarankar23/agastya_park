import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import { auth } from "@/middleware/auth";

import {
    validateEmail,
    validateRequiredFields,
} from "@/utils/validations";


// ======================================
// GET PROFILE
// ======================================

export async function GET(req) {
    try {
        await connectDB();

        const loggedInUser = auth(req);

        const user = await User.findById(
            loggedInUser.id
        ).select(
            "-password -otp -otpExpiry -__v"
        );

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

        return NextResponse.json(
            {
                success: true,
                data: user,
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
                    "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }
}


// ======================================
// UPDATE PROFILE
// ======================================

export async function PUT(req) {
    try {
        await connectDB();

        const loggedInUser = auth(req);

        const body = await req.json();

        const {
            name,
            email,
            profileImage,
        } = body;

        const validation =
            validateRequiredFields(body, [
                "name",
                "email",
            ]);

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid email address.",
                },
                {
                    status: 400,
                }
            );
        }

        const existingEmail =
            await User.findOne({
                email: email.toLowerCase(),
                _id: {
                    $ne: loggedInUser.id,
                },
            });

        if (existingEmail) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Email already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        const user =
            await User.findByIdAndUpdate(
                loggedInUser.id,
                {
                    name,

                    email:
                        email.toLowerCase(),

                    profileImage,
                },
                {
                    new: true,
                }
            ).select(
                "-password -otp -otpExpiry -__v"
            );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Profile updated successfully.",

                data: user,
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