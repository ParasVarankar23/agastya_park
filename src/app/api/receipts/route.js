import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import Receipt from "@/models/Receipt.model";
import Maintenance from "@/models/Maintenance.model";
import Owner from "@/models/Owner.model";

import { validateRequiredFields } from "@/utils/validations";

import { generateReceiptNumber } from "@/utils/generateReceiptNumber";

import { sendReceiptEmail } from "@/utils/sendReceiptEmail";

import {
    generatePDF,
    generateReceiptPDF,
} from "@/utils/pdf";

import fs from "fs";
import path from "path";


// ========================================
// GET
// ========================================

export async function GET(req) {
    try {
        await connectDB();

        auth(req);

        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const roomNumber =
            searchParams.get("roomNumber");

        // Single Receipt

        if (id) {
            const receipt =
                await Receipt.findById(id)
                    .populate("ownerId")
                    .populate("maintenanceId");

            if (!receipt) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Receipt not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json({
                success: true,
                data: receipt,
            });
        }

        // Filters

        let filter = {};

        if (month) {
            filter.month = month;
        }

        if (year) {
            filter.year = Number(year);
        }

        if (roomNumber) {
            filter.roomNumber =
                roomNumber;
        }

        const receipts =
            await Receipt.find(filter)
                .populate("ownerId")
                .populate("maintenanceId")
                .sort({
                    paymentDate: -1,
                });

        return NextResponse.json({
            success: true,
            total: receipts.length,
            data: receipts,
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
// Generate Receipt
// ========================================

export async function POST(req) {
    try {
        await connectDB();

        auth(req);

        const body =
            await req.json();

        const {
            maintenanceId,
            paymentMode,
            transactionId,
            remarks,
        } = body;

        const validation =
            validateRequiredFields(
                body,
                [
                    "maintenanceId",
                    "paymentMode",
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

        // Maintenance

        const maintenance =
            await Maintenance.findById(
                maintenanceId
            );

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

        // Already Generated

        const exists =
            await Receipt.findOne({
                maintenanceId,
            });

        if (exists) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Receipt already generated.",
                },
                {
                    status: 409,
                }
            );
        }

        // Owner

        const owner =
            await Owner.findById(
                maintenance.ownerId
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

        // Receipt Number

        const receiptNumber =
            await generateReceiptNumber();

        // Create Receipt

        const receipt =
            await Receipt.create({
                receiptNumber,

                ownerId:
                    owner._id,

                maintenanceId:
                    maintenance._id,

                ownerName:
                    owner.ownerName,

                roomNumber:
                    owner.roomNumber,

                month:
                    maintenance.month,

                year:
                    maintenance.year,

                amount:
                    maintenance.amount,

                paymentMode,

                paymentDate:
                    new Date(),

                transactionId:
                    transactionId ||
                    "",

                remarks:
                    remarks || "",
            });

        // Update Maintenance

        maintenance.paymentStatus =
            "Paid";

        maintenance.paymentMode =
            paymentMode;

        maintenance.paymentDate =
            new Date();

        maintenance.transactionId =
            transactionId || "";

        await maintenance.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Receipt generated successfully.",

                data: receipt,
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
                        "Receipt ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const receipt =
            await Receipt.findById(id);

        if (!receipt) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Receipt not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await Receipt.findByIdAndDelete(
            id
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Receipt deleted successfully.",
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
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}



// ========================================
// GENERATE PDF
// ========================================

export async function generateReceipt(
    receiptId
) {
    const receipt =
        await Receipt.findById(
            receiptId
        );

    if (!receipt) {
        throw new Error(
            "Receipt not found."
        );
    }

    const pdfDirectory = path.join(
        process.cwd(),
        "public",
        "receipts"
    );

    if (
        !fs.existsSync(pdfDirectory)
    ) {
        fs.mkdirSync(pdfDirectory, {
            recursive: true,
        });
    }

    const pdfPath = path.join(
        pdfDirectory,
        `${receipt.receiptNumber}.pdf`
    );

    const doc = generatePDF();

    doc.pipe(
        fs.createWriteStream(
            pdfPath
        )
    );

    generateReceiptPDF(doc, {
        receiptNumber:
            receipt.receiptNumber,

        ownerName:
            receipt.ownerName,

        roomNumber:
            receipt.roomNumber,

        month:
            receipt.month,

        amount:
            receipt.amount,

        paymentMode:
            receipt.paymentMode,

        paymentDate:
            receipt.paymentDate,
    });

    doc.end();

    return `/receipts/${receipt.receiptNumber}.pdf`;
}



// ========================================
// SEND RECEIPT EMAIL
// ========================================

export async function sendReceipt(
    receiptId
) {
    const receipt =
        await Receipt.findById(
            receiptId
        );

    if (!receipt) {
        throw new Error(
            "Receipt not found."
        );
    }

    const owner =
        await Owner.findById(
            receipt.ownerId
        );

    if (!owner) {
        throw new Error(
            "Owner not found."
        );
    }

    await sendReceiptEmail({
        email: owner.email,

        ownerName:
            receipt.ownerName,

        receiptNumber:
            receipt.receiptNumber,

        amount:
            receipt.amount,

        month:
            receipt.month,

        paymentMode:
            receipt.paymentMode,

        paymentDate:
            receipt.paymentDate,
    });

    return true;
}
