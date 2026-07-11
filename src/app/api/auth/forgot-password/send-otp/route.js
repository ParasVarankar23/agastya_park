import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User.model";

import {
    validateEmail,
    validateRequiredFields,
} from "@/utils/validations";

import { sendEmail } from "@/utils/nodemailer";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { email } = body;

        // Required Validation
        const validation =
            validateRequiredFields(body, [
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

        // Find User
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Email not registered.",
                },
                {
                    status: 404,
                }
            );
        }

        // Generate 6 Digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP Expiry (10 Minutes)
        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Save OTP
        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

        // Email HTML
        const html = `
            <div style="font-family:Arial,sans-serif;padding:20px">

                <h2>Agastya Park</h2>

                <p>Hello <b>${user.name}</b>,</p>

                <p>Your OTP for password reset is:</p>

                <h1 style="color:#2563eb;">
                    ${otp}
                </h1>

                <p>
                    This OTP will expire in
                    <b>10 minutes</b>.
                </p>

                <br>

                <p>
                    If you did not request this,
                    please ignore this email.
                </p>

            </div>
        `;

        // Send Email
        const emailResponse =
            await sendEmail({
                to: user.email,
                subject:
                    "Password Reset OTP",
                html,
            });

        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unable to send OTP email.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "OTP sent successfully.",
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