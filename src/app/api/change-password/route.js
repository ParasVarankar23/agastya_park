import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";

import {
    comparePassword,
    hashPassword,
} from "@/utils/hashPassword";

import {
    verifyAccessToken,
} from "@/utils/jwt";

export async function PUT(req) {
    try {
        await connectDB();

        const authHeader =
            req.headers.get("authorization");

        if (!authHeader) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Token missing",
                },
                { status: 401 }
            );
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            verifyAccessToken(token);

        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                { status: 401 }
            );
        }

        const {
            oldPassword,
            newPassword,
            confirmPassword,
        } = await req.json();

        if (
            !oldPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All fields are required",
                },
                { status: 400 }
            );
        }

        if (
            newPassword !== confirmPassword
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password and confirm password do not match",
                },
                { status: 400 }
            );
        }

        const user =
            await User.findById(
                decoded.id
            );

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const isMatch =
            await comparePassword(
                oldPassword,
                user.password
            );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Old password is incorrect",
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

        await user.save();

        return NextResponse.json({
            success: true,
            message:
                "Password changed successfully",
        });
    } catch (error) {
        console.error(
            "Change Password Error:",
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