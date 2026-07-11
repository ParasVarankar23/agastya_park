import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const auth = (req) => {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                success: false,
                message: "Unauthorized",
                status: 401,
            };
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        return {
            success: true,
            user: decoded,
        };
    } catch (error) {
        return {
            success: false,
            message: "Invalid or Expired Token",
            status: 401,
        };
    }
};