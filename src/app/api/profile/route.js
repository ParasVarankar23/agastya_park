import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { verifyAccessToken } from "@/utils/jwt";

// GET PROFILE
export async function GET(req) {
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

        const user =
            await User.findById(
                decoded.id
            ).select("-password");

        return NextResponse.json({
            success: true,
            data: user,
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

// UPDATE PROFILE
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

        const body =
            await req.json();

        const user =
            await User.findByIdAndUpdate(
                decoded.id,
                {
                    name: body.name,
                    email: body.email,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        return NextResponse.json({
            success: true,
            message:
                "Profile updated successfully",
            data: user,
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