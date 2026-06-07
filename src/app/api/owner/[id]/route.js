import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Owner from "@/models/Owner.model";

// GET SINGLE OWNER
export async function GET(
    req,
    { params }
) {
    try {
        await connectDB();

        const owner = await Owner.findById(
            params.id
        );

        if (!owner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Owner not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
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

// UPDATE OWNER
export async function PUT(
    req,
    { params }
) {
    try {
        await connectDB();

        const body = await req.json();

        const owner =
            await Owner.findByIdAndUpdate(
                params.id,
                body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!owner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Owner not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message:
                "Owner updated successfully",
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

// DELETE OWNER
export async function DELETE(
    req,
    { params }
) {
    try {
        await connectDB();

        const owner =
            await Owner.findByIdAndDelete(
                params.id
            );

        if (!owner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Owner not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message:
                "Owner deleted successfully",
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