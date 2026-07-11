import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { auth } from "@/middleware/auth";
import Owner from "@/models/Owner.model";
import Maintenance from "@/models/Maintenance.model";
import Expense from "@/models/Expense.model";
import Receipt from "@/models/Receipt.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectDB();
        auth(req);

        const { searchParams } = new URL(req.url);
        const month = searchParams.get("month");
        const year = Number(searchParams.get("year"));
        const hasMonthYear = Boolean(month) && Number.isFinite(year);
        const filter = hasMonthYear ? { month, year } : {};

        const [ownerCount, maintenance, receipts, expenses] = await Promise.all([
            Owner.countDocuments(),
            Maintenance.find(filter),
            Receipt.find(filter),
            Expense.find(filter),
        ]);

        const totalMaintenance = maintenance.reduce((sum, item) => sum + (item.amount || 0), 0);
        const paidAmount = maintenance
            .filter((item) => item.paymentStatus === "Paid")
            .reduce((sum, item) => sum + (item.amount || 0), 0);
        const pendingAmount = maintenance
            .filter((item) => item.paymentStatus !== "Paid")
            .reduce((sum, item) => sum + (item.amount || 0), 0);

        const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalReceipt = receipts.reduce((sum, item) => sum + (item.amount || 0), 0);

        const collectionPercentage = totalMaintenance === 0 ? 0 : Number(((paidAmount / totalMaintenance) * 100).toFixed(2));

        const [monthlyCollection, monthlyExpense, expenseCategory, yearlySummary, ownerWiseReport, pendingOwners, paidOwners] = await Promise.all([
            Maintenance.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: { month: "$month", year: "$year" },
                        totalMaintenance: { $sum: "$amount" },
                        paidAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0],
                            },
                        },
                        pendingAmount: {
                            $sum: {
                                $cond: [{ $ne: ["$paymentStatus", "Paid"] }, "$amount", 0],
                            },
                        },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Expense.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: { month: "$month", year: "$year" },
                        totalExpense: { $sum: "$amount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Expense.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: "$expenseType",
                        total: { $sum: "$amount" },
                    },
                },
                { $sort: { total: -1 } },
            ]),
            Maintenance.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: "$year",
                        totalMaintenance: { $sum: "$amount" },
                        paidAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0],
                            },
                        },
                        pendingAmount: {
                            $sum: {
                                $cond: [{ $ne: ["$paymentStatus", "Paid"] }, "$amount", 0],
                            },
                        },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            Maintenance.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: "owners",
                        localField: "ownerId",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                { $unwind: "$owner" },
                {
                    $group: {
                        _id: "$ownerId",
                        ownerName: { $first: "$owner.ownerName" },
                        roomNumber: { $first: "$owner.roomNumber" },
                        mobileNumber: { $first: "$owner.mobileNumber" },
                        totalMaintenance: { $sum: "$amount" },
                        paidAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0],
                            },
                        },
                        pendingAmount: {
                            $sum: {
                                $cond: [{ $ne: ["$paymentStatus", "Paid"] }, "$amount", 0],
                            },
                        },
                        totalMonths: { $sum: 1 },
                    },
                },
                { $sort: { roomNumber: 1 } },
            ]),
            Maintenance.aggregate([
                { $match: { ...filter, paymentStatus: { $ne: "Paid" } } },
                {
                    $lookup: {
                        from: "owners",
                        localField: "ownerId",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                { $unwind: "$owner" },
                {
                    $project: {
                        _id: 1,
                        ownerName: "$owner.ownerName",
                        roomNumber: "$owner.roomNumber",
                        mobileNumber: "$owner.mobileNumber",
                        email: "$owner.email",
                        month: 1,
                        year: 1,
                        amount: 1,
                        paymentStatus: 1,
                    },
                },
                { $sort: { roomNumber: 1 } },
            ]),
            Maintenance.aggregate([
                { $match: { ...filter, paymentStatus: "Paid" } },
                {
                    $lookup: {
                        from: "owners",
                        localField: "ownerId",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                { $unwind: "$owner" },
                {
                    $project: {
                        _id: 1,
                        ownerName: "$owner.ownerName",
                        roomNumber: "$owner.roomNumber",
                        mobileNumber: "$owner.mobileNumber",
                        email: "$owner.email",
                        month: 1,
                        year: 1,
                        amount: 1,
                        paymentStatus: 1,
                    },
                },
                { $sort: { roomNumber: 1 } },
            ]),
        ]);

        const totalPendingOwners = pendingOwners.length;
        const totalPaidOwners = paidOwners.length;
        const pendingCollection = pendingOwners.reduce((sum, item) => sum + (item.amount || 0), 0);
        const paidCollection = paidOwners.reduce((sum, item) => sum + (item.amount || 0), 0);

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
                    balance: paidAmount - totalExpense,
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
                    paidMaintenance: maintenance.filter((item) => item.paymentStatus === "Paid"),
                    pendingMaintenance: maintenance.filter((item) => item.paymentStatus !== "Paid"),
                    monthlyBalance: monthlyCollection,
                },
                recentReceipts: receipts.slice(-5).reverse(),
                recentExpenses: expenses.slice(-5).reverse(),
                topExpenses: expenseCategory.slice(0, 5),
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
