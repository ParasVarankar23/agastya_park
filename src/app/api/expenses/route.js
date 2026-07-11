import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import Expense from "@/models/Expense.model";

import {
    validateRequiredFields,
    validatePositiveNumber,
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
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const expenseType =
            searchParams.get("expenseType");

        // Get Single Expense

        if (id) {
            const expense =
                await Expense.findById(id);

            if (!expense) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Expense not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json({
                success: true,
                data: expense,
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

        if (expenseType) {
            filter.expenseType =
                expenseType;
        }

        const expenses =
            await Expense.find(filter).sort({
                expenseDate: -1,
            });

        const totalAmount =
            expenses.reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );

        return NextResponse.json({
            success: true,
            total: expenses.length,
            totalAmount,
            data: expenses,
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
// ========================================

export async function POST(req) {
    try {
        await connectDB();

        auth(req);

        const body =
            await req.json();

        const {
            expenseType,
            amount,
            expenseDate,
            month,
            year,
            billImage,
            remarks,
        } = body;

        const validation =
            validateRequiredFields(
                body,
                [
                    "expenseType",
                    "amount",
                    "expenseDate",
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

        if (
            !validatePositiveNumber(
                amount
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Amount.",
                },
                {
                    status: 400,
                }
            );
        }

        const expense =
            await Expense.create({
                expenseType,

                amount,

                expenseDate,

                month,

                year,

                billImage:
                    billImage || "",

                remarks:
                    remarks || "",
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Expense added successfully.",

                data: expense,
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
// ========================================

export async function PUT(req) {
    try {
        await connectDB();

        auth(req);

        const body = await req.json();

        const {
            id,
            expenseType,
            amount,
            expenseDate,
            month,
            year,
            billImage,
            remarks,
        } = body;

        const validation =
            validateRequiredFields(body, [
                "id",
                "expenseType",
                "amount",
                "expenseDate",
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

        if (!validatePositiveNumber(amount)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Amount.",
                },
                {
                    status: 400,
                }
            );
        }

        const expense =
            await Expense.findById(id);

        if (!expense) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Expense not found.",
                },
                {
                    status: 404,
                }
            );
        }

        expense.expenseType =
            expenseType;

        expense.amount = amount;

        expense.expenseDate =
            expenseDate;

        expense.month = month;

        expense.year = year;

        expense.billImage =
            billImage || "";

        expense.remarks =
            remarks || "";

        await expense.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Expense updated successfully.",
                data: expense,
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
                        "Expense ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const expense =
            await Expense.findById(id);

        if (!expense) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Expense not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await Expense.findByIdAndDelete(
            id
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Expense deleted successfully.",
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