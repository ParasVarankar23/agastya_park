import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Maintenance from "@/models/Maintenance.model";

// GET SINGLE
export async function GET(
    req,
    { params }
) {
    try {
        await connectDB();

        const maintenance =
            await Maintenance.findById(
                params.id
            );

        return NextResponse.json({
            success: true,
            data: maintenance,
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

// UPDATE PAYMENT
export async function PUT(
    req,
    { params }
) {
    try {
        await connectDB();

        const body =
            await req.json();

        const maintenance =
            await Maintenance.findById(
                params.id
            );

        if (!maintenance) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Record not found",
                },
                { status: 404 }
            );
        }

        maintenance.paidAmount =
            body.paidAmount;

        await maintenance.save();

        return NextResponse.json({
            success: true,
            message:
                "Payment updated",
            data: maintenance,
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

// DELETE
export async function DELETE(
    req,
    { params }
) {
    try {
        await connectDB();

        await Maintenance.findByIdAndDelete(
            params.id
        );

        return NextResponse.json({
            success: true,
            message:
                "Maintenance deleted",
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