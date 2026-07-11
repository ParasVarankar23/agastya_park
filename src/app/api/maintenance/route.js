import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import Owner from "@/models/Owner.model";
import Maintenance from "@/models/Maintenance.model";

import {
    validateRequiredFields,
} from "@/utils/validations";



// ========================================
// GET
// ========================================

export async function GET(req) {
    try {
        await connectDB();

        auth(req);

        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");
        const month =
            searchParams.get("month");
        const year =
            searchParams.get("year");

        // Get Single Maintenance

        if (id) {
            const maintenance =
                await Maintenance.findById(id)
                    .populate("ownerId");

            if (!maintenance) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Maintenance not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json({
                success: true,
                data: maintenance,
            });
        }

        // Filter Month

        let filter = {};

        if (month) {
            filter.month = month;
        }

        if (year) {
            filter.year = Number(year);
        }

        const maintenances =
            await Maintenance.find(filter)
                .populate("ownerId")
                .sort({
                    roomNumber: 1,
                });

        return NextResponse.json({
            success: true,
            total: maintenances.length,
            data: maintenances,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}



// ========================================
// POST
// Generate Monthly Maintenance
// ========================================

export async function POST(req) {
    try {
        await connectDB();

        auth(req);

        const body =
            await req.json();

        const {
            ownerId,
            month,
            year,
        } = body;

        const validation =
            validateRequiredFields(
                body,
                [
                    "ownerId",
                    "month",
                    "year",
                ]
            );

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        // Find Owner

        const owner =
            await Owner.findById(
                ownerId
            );

        if (!owner) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Owner not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // Duplicate Check

        const exists =
            await Maintenance.findOne({
                ownerId,
                month,
                year,
            });

        if (exists) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Maintenance already generated for this month.",
                },
                {
                    status: 409,
                }
            );
        }

        // Create Maintenance

        const maintenance =
            await Maintenance.create({
                ownerId,

                roomNumber:
                    owner.roomNumber,

                month,

                year,

                amount:
                    owner.monthlyMaintenance,

                paymentStatus:
                    "Pending",

                paymentMode: "",

                transactionId: "",

                paymentDate: null,

                remarks: "",
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Maintenance generated successfully.",

                data: maintenance,
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
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}
// ========================================
// PUT
// Update Maintenance Payment
// ========================================

export async function PUT(req) {
    try {
        await connectDB();

        auth(req);

        const body = await req.json();

        const {
            id,
            paymentStatus,
            paymentMode,
            transactionId,
            paymentDate,
            remarks,
        } = body;

        const validation = validateRequiredFields(
            body,
            [
                "id",
                "paymentStatus",
            ]
        );

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        const maintenance =
            await Maintenance.findById(id);

        if (!maintenance) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Maintenance not found.",
                },
                {
                    status: 404,
                }
            );
        }

        maintenance.paymentStatus =
            paymentStatus;

        maintenance.paymentMode =
            paymentMode || "";

        maintenance.transactionId =
            transactionId || "";

        maintenance.paymentDate =
            paymentDate || null;

        maintenance.remarks =
            remarks || "";

        await maintenance.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Maintenance updated successfully.",
                data: maintenance,
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



// ========================================
// DELETE
// ========================================

export async function DELETE(req) {
    try {
        await connectDB();

        auth(req);

        const { searchParams } =
            new URL(req.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Maintenance ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const maintenance =
            await Maintenance.findById(id);

        if (!maintenance) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Maintenance not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await Maintenance.findByIdAndDelete(
            id
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Maintenance deleted successfully.",
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