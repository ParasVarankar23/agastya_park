import { sendEmail } from "./nodemailer";

export const sendReceiptEmail = async ({
    email,
    ownerName,
    receiptNumber,
    amount,
    month,
    paymentMode,
    paymentDate,
}) => {
    const html = `
        <div style="font-family:Arial,sans-serif;padding:20px">

            <h2>Maintenance Payment Receipt</h2>

            <p>Hello <strong>${ownerName}</strong>,</p>

            <p>Your maintenance payment has been received successfully.</p>

            <table style="border-collapse:collapse">

                <tr>
                    <td><strong>Receipt No :</strong></td>
                    <td>${receiptNumber}</td>
                </tr>

                <tr>
                    <td><strong>Month :</strong></td>
                    <td>${month}</td>
                </tr>

                <tr>
                    <td><strong>Amount :</strong></td>
                    <td>₹${amount}</td>
                </tr>

                <tr>
                    <td><strong>Payment Mode :</strong></td>
                    <td>${paymentMode}</td>
                </tr>

                <tr>
                    <td><strong>Payment Date :</strong></td>
                    <td>${paymentDate}</td>
                </tr>

            </table>

            <br>

            <p>Thank you for your payment.</p>

            <p>
                Regards,<br>
                Agastya Park Society
            </p>

        </div>
    `;

    return sendEmail({
        to: email,
        subject: "Maintenance Receipt",
        html,
    });
};