import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Owner from "@/models/Owner.model";

// CREATE OWNER
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const owner = await Owner.create(body);

        return NextResponse.json({
            success: true,
            message: "Owner created successfully",
            data: owner,
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

// GET ALL OWNERS
export async function GET() {
    try {
        await connectDB();

        const owners = await Owner.find()
            .sort({ roomNo: 1 });

        return NextResponse.json({
            success: true,
            count: owners.length,
            data: owners,
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