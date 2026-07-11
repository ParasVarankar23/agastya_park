import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import { auth } from "@/middleware/auth";

import {
    comparePassword,
    hashPassword,
} from "@/utils/hashPassword";

import {
    validatePassword,
    validateRequiredFields,
} from "@/utils/validations";

export async function PUT(req) {
    try {
        await connectDB();

        const loggedInUser = auth(req);

        const body = await req.json();

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = body;

        // Required Validation
        const validation =
            validateRequiredFields(body, [
                "currentPassword",
                "newPassword",
                "confirmPassword",
            ]);

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        // Password Length
        if (!validatePassword(newPassword)) {
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
        if (
            newPassword !==
            confirmPassword
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New Password and Confirm Password do not match.",
                },
                {
                    status: 400,
                }
            );
        }

        // Find User
        const user =
            await User.findById(
                loggedInUser.id
            );

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // Check Current Password
        const isMatch =
            await comparePassword(
                currentPassword,
                user.password
            );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Current password is incorrect.",
                },
                {
                    status: 400,
                }
            );
        }

        // Prevent Same Password
        const samePassword =
            await comparePassword(
                newPassword,
                user.password
            );

        if (samePassword) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password cannot be the same as the current password.",
                },
                {
                    status: 400,
                }
            );
        }

        // Hash New Password
        const hashedPassword =
            await hashPassword(
                newPassword
            );

        // Update Password
        user.password =
            hashedPassword;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Password changed successfully.",
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