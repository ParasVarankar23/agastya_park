import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import Issue from "@/models/Issue.model";

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
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");

        // Get Single Issue

        if (id) {
            const issue = await Issue.findById(id);

            if (!issue) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Issue not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return NextResponse.json({
                success: true,
                data: issue,
            });
        }

        // Filters

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        const issues = await Issue.find(filter).sort({
            createdAt: -1,
        });

        return NextResponse.json({
            success: true,
            total: issues.length,
            data: issues,
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

        const body = await req.json();

        const {
            issueTitle,
            category,
            description,
            priority,
            estimatedCost,
            actualCost,
            beforeImages,
            afterImages,
            billImage,
            status,
            startDate,
            expectedCompletionDate,
            completedDate,
            remarks,
        } = body;

        const validation =
            validateRequiredFields(body, [
                "issueTitle",
                "category",
                "description",
                "priority",
            ]);

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        if (
            estimatedCost &&
            !validatePositiveNumber(
                estimatedCost
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Estimated Cost.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            actualCost &&
            !validatePositiveNumber(
                actualCost
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Actual Cost.",
                },
                {
                    status: 400,
                }
            );
        }

        const issue =
            await Issue.create({
                issueTitle,

                category,

                description,

                priority,

                estimatedCost:
                    estimatedCost || 0,

                actualCost:
                    actualCost || 0,

                beforeImages:
                    beforeImages || [],

                afterImages:
                    afterImages || [],

                billImage:
                    billImage || "",

                status:
                    status || "Pending",

                startDate:
                    startDate || null,

                expectedCompletionDate:
                    expectedCompletionDate ||
                    null,

                completedDate:
                    completedDate || null,

                remarks:
                    remarks || "",
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Issue created successfully.",
                data: issue,
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
            issueTitle,
            category,
            description,
            priority,
            estimatedCost,
            actualCost,
            beforeImages,
            afterImages,
            billImage,
            status,
            startDate,
            expectedCompletionDate,
            completedDate,
            remarks,
        } = body;

        const validation =
            validateRequiredFields(body, [
                "id",
                "issueTitle",
                "category",
                "description",
                "priority",
            ]);

        if (!validation.success) {
            return NextResponse.json(
                validation,
                {
                    status: 400,
                }
            );
        }

        if (
            estimatedCost &&
            !validatePositiveNumber(
                estimatedCost
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Estimated Cost.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            actualCost &&
            !validatePositiveNumber(
                actualCost
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Actual Cost.",
                },
                {
                    status: 400,
                }
            );
        }

        const issue =
            await Issue.findById(id);

        if (!issue) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Issue not found.",
                },
                {
                    status: 404,
                }
            );
        }

        issue.issueTitle =
            issueTitle;

        issue.category =
            category;

        issue.description =
            description;

        issue.priority =
            priority;

        issue.estimatedCost =
            estimatedCost || 0;

        issue.actualCost =
            actualCost || 0;

        issue.beforeImages =
            beforeImages || [];

        issue.afterImages =
            afterImages || [];

        issue.billImage =
            billImage || "";

        issue.status =
            status || "Pending";

        issue.startDate =
            startDate || null;

        issue.expectedCompletionDate =
            expectedCompletionDate ||
            null;

        issue.completedDate =
            completedDate || null;

        issue.remarks =
            remarks || "";

        await issue.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Issue updated successfully.",
                data: issue,
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
                        "Issue ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const issue =
            await Issue.findById(id);

        if (!issue) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Issue not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await Issue.findByIdAndDelete(
            id
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Issue deleted successfully.",
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