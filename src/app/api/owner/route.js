import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Owner from "@/models/Owner.model";

import { auth } from "@/middleware/auth";

import {
    validateEmail,
    validatePhone,
    validateRequiredFields,
} from "@/utils/validations";

import { calculateMaintenance } from "@/utils/calculateMaintenance";



// =========================================
// GET
// =========================================

export async function GET(req) {
    try {
        await connectDB();

        auth(req);

        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");

        // Get Single Owner
        if (id) {
            const owner =
                await Owner.findById(id);

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

            return NextResponse.json({
                success: true,
                data: owner,
            });
        }

        // Get All Owners

        const owners = await Owner.find().sort({
            roomNumber: 1,
        });

        return NextResponse.json({
            success: true,
            total: owners.length,
            data: owners,
        });
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



// =========================================
// POST
// =========================================

export async function POST(req) {
    try {
        await connectDB();

        auth(req);

        const body = await req.json();

        const {
            ownerName,
            email,
            mobileNumber,
            alternateNumber,
            roomNumber,
            floor,
            carpetArea,
            builtUpArea,
            maintenanceRate,
        } = body;

        // Required Validation

        const validation =
            validateRequiredFields(body, [
                "ownerName",
                "email",
                "mobileNumber",
                "roomNumber",
                "floor",
                "builtUpArea",
                "maintenanceRate",
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
                        "Invalid Email.",
                },
                {
                    status: 400,
                }
            );
        }

        // Mobile Validation

        if (
            !validatePhone(
                mobileNumber
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Mobile Number.",
                },
                {
                    status: 400,
                }
            );
        }

        // Duplicate Email

        const emailExists =
            await Owner.findOne({
                email: email.toLowerCase(),
            });

        if (emailExists) {
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

        // Duplicate Room

        const roomExists =
            await Owner.findOne({
                roomNumber,
            });

        if (roomExists) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Room Number already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        // Calculate Maintenance

        const monthlyMaintenance =
            calculateMaintenance(
                builtUpArea,
                maintenanceRate
            );

        // Create Owner

        const owner =
            await Owner.create({
                ownerName,

                email:
                    email.toLowerCase(),

                mobileNumber,

                alternateNumber,

                roomNumber,

                floor,

                carpetArea,

                builtUpArea,

                maintenanceRate,

                monthlyMaintenance,
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Owner created successfully.",

                data: owner,
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
                    "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}

// =========================================
// PUT
// =========================================

export async function PUT(req) {
    try {
        await connectDB();

        auth(req);

        const body = await req.json();

        const {
            id,
            ownerName,
            email,
            mobileNumber,
            alternateNumber,
            roomNumber,
            floor,
            carpetArea,
            builtUpArea,
            maintenanceRate,
        } = body;

        const validation =
            validateRequiredFields(body, [
                "id",
                "ownerName",
                "email",
                "mobileNumber",
                "roomNumber",
                "floor",
                "builtUpArea",
                "maintenanceRate",
            ]);

        if (!validation.success) {
            return NextResponse.json(validation, {
                status: 400,
            });
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Email.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!validatePhone(mobileNumber)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Mobile Number.",
                },
                {
                    status: 400,
                }
            );
        }

        const owner =
            await Owner.findById(id);

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

        const emailExists =
            await Owner.findOne({
                email: email.toLowerCase(),
                _id: { $ne: id },
            });

        if (emailExists) {
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

        const roomExists =
            await Owner.findOne({
                roomNumber,
                _id: { $ne: id },
            });

        if (roomExists) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Room Number already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        const monthlyMaintenance =
            calculateMaintenance(
                builtUpArea,
                maintenanceRate
            );

        owner.ownerName = ownerName;

        owner.email =
            email.toLowerCase();

        owner.mobileNumber =
            mobileNumber;

        owner.alternateNumber =
            alternateNumber;

        owner.roomNumber =
            roomNumber;

        owner.floor = floor;

        owner.carpetArea =
            carpetArea;

        owner.builtUpArea =
            builtUpArea;

        owner.maintenanceRate =
            maintenanceRate;

        owner.monthlyMaintenance =
            monthlyMaintenance;

        await owner.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Owner updated successfully.",
                data: owner,
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

// =========================================
// DELETE
// =========================================

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
                        "Owner ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const owner =
            await Owner.findById(id);

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

        await Owner.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message:
                    "Owner deleted successfully.",
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