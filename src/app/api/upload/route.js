import { NextResponse } from "next/server";

import { auth } from "@/middleware/auth";

import { uploadToCloudinary } from "@/utils/cloudinary";

import { deleteFromCloudinary } from "@/utils/cloudinary";


export async function POST(req) {
    try {

        auth(req);

        const formData =
            await req.formData();

        const file =
            formData.get("file");

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "File is required.",
                },
                {
                    status: 400,
                }
            );
        }

        // Allowed Types

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only JPG, PNG, WEBP and PDF files are allowed.",
                },
                {
                    status: 400,
                }
            );
        }

        // Max 10MB

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Maximum file size is 10MB.",
                },
                {
                    status: 400,
                }
            );
        }

        // Convert Buffer

        const bytes =
            await file.arrayBuffer();

        const buffer =
            Buffer.from(bytes);

        // Upload

        const upload =
            await uploadToCloudinary(
                buffer,
                file.name,
                file.type
            );

        return NextResponse.json(
            {
                success: true,
                message:
                    "File uploaded successfully.",

                data: {
                    url: upload.secure_url,
                    publicId:
                        upload.public_id,
                    format:
                        upload.format,
                    bytes:
                        upload.bytes,
                },
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
// DELETE FILE
// =========================================

export async function DELETE(req) {
    try {

        auth(req);

        const { searchParams } =
            new URL(req.url);

        const publicId =
            searchParams.get("publicId");

        if (!publicId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Public ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        await deleteFromCloudinary(
            publicId
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "File deleted successfully.",
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