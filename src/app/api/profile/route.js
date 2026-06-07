import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User.model";

import { verifyAccessToken } from "@/utils/jwt";

export async function GET(req) {
    try {
        await connectDB();

        const authHeader =
            req.headers.get("authorization");

        if (!authHeader) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Token Missing",
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
                    message: "Invalid Token",
                },
                { status: 401 }
            );
        }

        const user = await User.findById(
            decoded.id
        ).select("-password");

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}