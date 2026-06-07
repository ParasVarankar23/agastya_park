import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Maintenance from "@/models/Maintenance.model";
import Owner from "@/models/Owner.model";

// CREATE MAINTENANCE
export async function POST(req) {
    try {
        await connectDB();

        const {
            ownerId,
            month,
            year,
            paidAmount = 0,
        } = await req.json();

        const owner =
            await Owner.findById(ownerId);

        if (!owner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Owner not found",
                },
                { status: 404 }
            );
        }

        const maintenance =
            await Maintenance.create({
                ownerId: owner._id,
                roomNo: owner.roomNo,
                ownerName:
                    owner.ownerName,
                month,
                year,
                amount:
                    owner.monthlyMaintenance,
                paidAmount,
            });

        return NextResponse.json({
            success: true,
            message:
                "Maintenance created successfully",
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

// GET ALL MAINTENANCE
export async function GET() {
    try {
        await connectDB();

        const records =
            await Maintenance.find()
                .populate("ownerId")
                .sort({
                    createdAt: -1,
                });

        return NextResponse.json({
            success: true,
            count: records.length,
            data: records,
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