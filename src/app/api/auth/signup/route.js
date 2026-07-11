import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import { generatePassword } from "@/utils/generatePassword";
import { hashPassword } from "@/utils/hashPassword";

import { sendPasswordEmail } from "@/utils/sendPasswordEmail";

import {
    validateEmail,
    validateRequiredFields,
} from "@/utils/validations";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { name, email } = body;

        // Required Validation
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

        // Check Existing Email
        const existingUser =
            await User.findOne({
                email: email.toLowerCase(),
            });

        if (existingUser) {
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

        // Generate Password
        const generatedPassword =
            generatePassword(name);

        // Hash Password
        const hashedPassword =
            await hashPassword(
                generatedPassword
            );

        // Create Admin
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "admin",
            isVerified: true,
        });

        // Send Login Credentials
        await sendPasswordEmail(
            email,
            name,
            generatedPassword
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Admin account created successfully.",

                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            {
                status: 201,
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