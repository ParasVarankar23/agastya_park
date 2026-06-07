import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";

import { generatePassword } from "@/utils/generatePassword";
import { hashPassword } from "@/utils/hashPassword";
import { sendPasswordEmail } from "@/utils/sendEmail";

export async function POST(req) {
    try {
        await connectDB();

        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name and Email are required",
                },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already registered",
                },
                { status: 400 }
            );
        }

        const generatedPassword = generatePassword(name);

        const hashedPassword = await hashPassword(
            generatedPassword
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        await sendPasswordEmail(
            email,
            name,
            generatedPassword
        );

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            userId: user._id,
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