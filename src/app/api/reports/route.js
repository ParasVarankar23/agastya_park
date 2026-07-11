import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import Owner from "@/models/Owner.model";
import Maintenance from "@/models/Maintenance.model";
import Expense from "@/models/Expense.model";
import Receipt from "@/models/Receipt.model";



// ==========================================
// GET DASHBOARD REPORT
// ==========================================

export async function GET(req) {
    try {
        await connectDB();

        auth(req);

        const { searchParams } = new URL(req.url);

        const month = searchParams.get("month");
        const year = Number(searchParams.get("year"));

        const ownerCount =
            await Owner.countDocuments();

        const maintenance =
            await Maintenance.find(
                month && year
                    ? { month, year }
                    : {}
            );

        const receipts =
            await Receipt.find(
                month && year
                    ? { month, year }
                    : {}
            );

        const expenses =
            await Expense.find(
                month && year
                    ? { month, year }
                    : {}
            );



        // ==========================
        // Maintenance Summary
        // ==========================

        const totalMaintenance =
            maintenance.reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );

        const paidAmount =
            maintenance
                .filter(
                    (item) =>
                        item.paymentStatus ===
                        "Paid"
                )
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                );

        const pendingAmount =
            maintenance
                .filter(
                    (item) =>
                        item.paymentStatus !==
                        "Paid"
                )
                .reduce(
                    (sum, item) =>
                        sum + item.amount,
                    0
                );



        // ==========================
        // Expense Summary
        // ==========================

        const totalExpense =
            expenses.reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );



        // ==========================
        // Receipt Summary
        // ==========================

        const totalReceipt =
            receipts.reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );



        // ==========================
        // Collection %
        // ==========================

        const collectionPercentage =
            totalMaintenance === 0
                ? 0
                : Number(
                      (
                          (paidAmount /
                              totalMaintenance) *
                          100
                      ).toFixed(2)
                  );



        // ==========================
        // Response
        // ==========================

        return NextResponse.json(
            {
                success: true,

                dashboard: {
                    totalOwners:
                        ownerCount,

                    totalMaintenance,

                    totalReceipt,

                    totalExpense,

                    paidAmount,

                    pendingAmount,

                    balance:
                        paidAmount -
                        totalExpense,

                    collectionPercentage,
                },
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
// ==========================
// Monthly Collection Report
// ==========================

const monthlyCollection = await Maintenance.aggregate([
    {
        $group: {
            _id: {
                month: "$month",
                year: "$year",
            },

            totalMaintenance: {
                $sum: "$amount",
            },

            paidAmount: {
                $sum: {
                    $cond: [
                        {
                            $eq: [
                                "$paymentStatus",
                                "Paid",
                            ],
                        },
                        "$amount",
                        0,
                    ],
                },
            },

            pendingAmount: {
                $sum: {
                    $cond: [
                        {
                            $ne: [
                                "$paymentStatus",
                                "Paid",
                            ],
                        },
                        "$amount",
                        0,
                    ],
                },
            },
        },
    },

    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
        },
    },
]);



// ==========================
// Monthly Expense Report
// ==========================

const monthlyExpense = await Expense.aggregate([
    {
        $group: {
            _id: {
                month: "$month",
                year: "$year",
            },

            totalExpense: {
                $sum: "$amount",
            },
        },
    },

    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
        },
    },
]);



// ==========================
// Expense Category Report
// ==========================

const expenseCategory =
    await Expense.aggregate([
        {
            $group: {
                _id: "$expenseType",

                total: {
                    $sum: "$amount",
                },
            },
        },

        {
            $sort: {
                total: -1,
            },
        },
    ]);



// ==========================
// Yearly Summary
// ==========================

const yearlySummary =
    await Maintenance.aggregate([
        {
            $group: {
                _id: "$year",

                totalMaintenance: {
                    $sum: "$amount",
                },

                paidAmount: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$paymentStatus",
                                    "Paid",
                                ],
                            },
                            "$amount",
                            0,
                        ],
                    },
                },

                pendingAmount: {
                    $sum: {
                        $cond: [
                            {
                                $ne: [
                                    "$paymentStatus",
                                    "Paid",
                                ],
                            },
                            "$amount",
                            0,
                        ],
                    },
                },
            },
        },

        {
            $sort: {
                _id: 1,
            },
        },
    ]);

    // ==========================================
// OWNER WISE REPORT
// ==========================================

const ownerWiseReport =
    await Maintenance.aggregate([
        {
            $lookup: {
                from: "owners",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
            },
        },

        {
            $unwind: "$owner",
        },

        {
            $group: {
                _id: "$ownerId",

                ownerName: {
                    $first:
                        "$owner.ownerName",
                },

                roomNumber: {
                    $first:
                        "$owner.roomNumber",
                },

                mobileNumber: {
                    $first:
                        "$owner.mobileNumber",
                },

                totalMaintenance: {
                    $sum: "$amount",
                },

                paidAmount: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$paymentStatus",
                                    "Paid",
                                ],
                            },
                            "$amount",
                            0,
                        ],
                    },
                },

                pendingAmount: {
                    $sum: {
                        $cond: [
                            {
                                $ne: [
                                    "$paymentStatus",
                                    "Paid",
                                ],
                            },
                            "$amount",
                            0,
                        ],
                    },
                },

                totalMonths: {
                    $sum: 1,
                },
            },
        },

        {
            $sort: {
                roomNumber: 1,
            },
        },
    ]);// ==========================================
// PENDING OWNERS REPORT
// ==========================================

const pendingOwners =
    await Maintenance.aggregate([
        {
            $match: {
                paymentStatus: {
                    $ne: "Paid",
                },
            },
        },

        {
            $lookup: {
                from: "owners",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
            },
        },

        {
            $unwind: "$owner",
        },

        {
            $project: {
                _id: 1,

                ownerName:
                    "$owner.ownerName",

                roomNumber:
                    "$owner.roomNumber",

                mobileNumber:
                    "$owner.mobileNumber",

                email:
                    "$owner.email",

                month: 1,

                year: 1,

                amount: 1,

                paymentStatus: 1,
            },
        },

        {
            $sort: {
                roomNumber: 1,
            },
        },
    ]);



// ==========================================
// PAID OWNERS REPORT
// ==========================================

const paidOwners =
    await Maintenance.aggregate([
        {
            $match: {
                paymentStatus: "Paid",
            },
        },

        {
            $lookup: {
                from: "owners",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
            },
        },

        {
            $unwind: "$owner",
        },

        {
            $project: {
                _id: 1,

                ownerName:
                    "$owner.ownerName",

                roomNumber:
                    "$owner.roomNumber",

                mobileNumber:
                    "$owner.mobileNumber",

                email:
                    "$owner.email",

                month: 1,

                year: 1,

                amount: 1,

                paymentStatus: 1,
            },
        },

        {
            $sort: {
                roomNumber: 1,
            },
        },
    ]);



// ==========================================
// SUMMARY
// ==========================================

const totalPendingOwners =
    pendingOwners.length;

const totalPaidOwners =
    paidOwners.length;

const pendingCollection =
    pendingOwners.reduce(
        (sum, item) =>
            sum + item.amount,
        0
    );

const paidCollection =
    paidOwners.reduce(
        (sum, item) =>
            sum + item.amount,
        0
    );

    return NextResponse.json(
    {
        success: true,

        dashboard: {
            totalOwners: ownerCount,

            totalMaintenance,

            totalReceipt,

            totalExpense,

            paidAmount,

            pendingAmount,

            balance:
                paidAmount -
                totalExpense,

            collectionPercentage,
        },

        monthlyCollection,

        monthlyExpense,

        expenseCategory,

        yearlySummary,

        ownerWiseReport,

        pendingOwners,

        paidOwners,

        summary: {
            totalPendingOwners,
            totalPaidOwners,
            pendingCollection,
            paidCollection,
        },

        reports: {
            paidMaintenance,
            pendingMaintenance,
            monthlyBalance,
        },

        recentReceipts,

        recentExpenses,

        topExpenses,
    },
    {
        status: 200,
    }
);