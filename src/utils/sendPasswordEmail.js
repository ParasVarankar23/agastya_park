import { sendEmail } from "./nodemailer";

export const sendPasswordEmail = async (
    email,
    name,
    password
) => {
    const html = `
        <div style="font-family:Arial,sans-serif;padding:20px">

            <h2>Welcome to Agastya Park</h2>

            <p>Hello <strong>${name}</strong>,</p>

            <p>Your admin account has been created successfully.</p>

            <table style="border-collapse:collapse">
                <tr>
                    <td><strong>Email :</strong></td>
                    <td>${email}</td>
                </tr>

                <tr>
                    <td><strong>Password :</strong></td>
                    <td>${password}</td>
                </tr>
            </table>

            <br>

            <p>Please login and change your password immediately.</p>

            <br>

            <p>
                Regards,<br>
                Agastya Park Society
            </p>

        </div>
    `;

    return sendEmail({
        to: email,
        subject: "Agastya Park Login Credentials",
        html,
    });
};