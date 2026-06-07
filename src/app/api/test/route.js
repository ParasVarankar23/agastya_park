import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        await connectDB();

        return NextResponse.json({
            success: true,
            message: "MongoDB Connected Successfully 🚀",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "MongoDB Connection Failed ❌",
                error: error.message,
            },
            { status: 500 }
        );
    }
}