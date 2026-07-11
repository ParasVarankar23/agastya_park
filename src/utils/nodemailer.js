import nodemailer from "nodemailer";

const transporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

export default transporter;

// Send Email
export const sendEmail = async ({
    to,
    subject,
    html,
}) => {
    try {
        await transporter.sendMail({
            from: `"Agastya Park" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};