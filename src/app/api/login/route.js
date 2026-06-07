import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";

import { comparePassword } from "@/utils/hashPassword";

import {
    generateAccessToken,
    generateRefreshToken,
} from "@/utils/jwt";

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } =
            await req.json();

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Email",
                },
                { status: 401 }
            );
        }

        const isMatch =
            await comparePassword(
                password,
                user.password
            );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Password",
                },
                { status: 401 }
            );
        }

        const token =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        return NextResponse.json({
            success: true,
            message: "Login Successful",
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
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