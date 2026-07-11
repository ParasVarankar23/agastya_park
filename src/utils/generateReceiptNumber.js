import Receipt from "@/models/Receipt.model";

export const generateReceiptNumber =
    async () => {
        const year =
            new Date().getFullYear();

        const totalReceipts =
            await Receipt.countDocuments();

        const nextNumber = String(
            totalReceipts + 1
        ).padStart(6, "0");

        return `AGS${year}${nextNumber}`;
    };