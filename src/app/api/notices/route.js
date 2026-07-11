import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import Notice from "@/models/Notice.model";

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
        const noticeType = searchParams.get("noticeType");
        const month = searchParams.get("month");
        const year = searchParams.get("year");

        // Get Single Notice

        if (id) {
            const notice =
                await Notice.findById(id);

            if (!notice) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Notice not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json({
                success: true,
                data: notice,
            });
        }

        // Filters

        let filter = {};

        if (noticeType) {
            filter.noticeType = noticeType;
        }

        if (month) {
            filter.month = month;
        }

        if (year) {
            filter.year = Number(year);
        }

        const notices =
            await Notice.find(filter).sort({
                createdAt: -1,
            });

        return NextResponse.json({
            success: true,
            total: notices.length,
            data: notices,
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



// ========================================
// POST
// ========================================

export async function POST(req) {
    try {
        await connectDB();

        auth(req);

        const body =
            await req.json();

        const {
            noticeType,
            title,
            description,
            month,
            year,
            startMonth,
            endMonth,
            attachment,
            ownerName,
            roomNumber,
            pendingAmount,
        } = body;

        const validation =
            validateRequiredFields(
                body,
                [
                    "noticeType",
                    "title",
                    "description",
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

        const notice =
            await Notice.create({
                noticeType,

                title,

                description,

                month,

                year,

                startMonth:
                    startMonth || "",

                endMonth:
                    endMonth || "",

                ownerName:
                    ownerName || "",

                roomNumber:
                    roomNumber || "",

                pendingAmount:
                    pendingAmount || 0,

                attachment:
                    attachment || "",
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Notice created successfully.",

                data: notice,
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
// ========================================
// PUT
// ========================================

export async function PUT(req) {
    try {
        await connectDB();

        auth(req);

        const body = await req.json();

        const {
            id,
            noticeType,
            title,
            description,
            month,
            year,
            startMonth,
            endMonth,
            ownerName,
            roomNumber,
            pendingAmount,
            attachment,
        } = body;

        const validation =
            validateRequiredFields(body, [
                "id",
                "noticeType",
                "title",
                "description",
                "month",
                "year",
            ]);

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        const notice =
            await Notice.findById(id);

        if (!notice) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Notice not found.",
                },
                {
                    status: 404,
                }
            );
        }

        notice.noticeType =
            noticeType;

        notice.title = title;

        notice.description =
            description;

        notice.month = month;

        notice.year = year;

        notice.startMonth =
            startMonth || "";

        notice.endMonth =
            endMonth || "";

        notice.ownerName =
            ownerName || "";

        notice.roomNumber =
            roomNumber || "";

        notice.pendingAmount =
            pendingAmount || 0;

        notice.attachment =
            attachment || "";

        await notice.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Notice updated successfully.",
                data: notice,
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
                        "Notice ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const notice =
            await Notice.findById(id);

        if (!notice) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Notice not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await Notice.findByIdAndDelete(
            id
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Notice deleted successfully.",
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