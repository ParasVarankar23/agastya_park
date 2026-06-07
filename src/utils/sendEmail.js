import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// ===============================
// SEND ACCOUNT PASSWORD EMAIL
// ===============================
export async function sendPasswordEmail(
    email,
    name,
    password
) {
    try {
        const info = await transporter.sendMail({
            from: `"Agastya Park" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Welcome to Agastya Park Maintenance System",
            html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7f6;padding:20px;">
        
        <div style="
          max-width:650px;
          margin:auto;
          background:#fff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
        ">
          
          <div style="
            background:linear-gradient(135deg,#16a34a,#22c55e);
            color:white;
            padding:35px;
            text-align:center;
          ">
            <h1>Agastya Park</h1>
            <p>Devad, Panvel</p>
          </div>

          <div style="padding:35px;">
            <h2>Hello ${name} 👋</h2>

            <p>
              Your account has been created successfully.
            </p>

            <div style="
              background:#f0fdf4;
              border:2px dashed #22c55e;
              padding:20px;
              border-radius:12px;
              text-align:center;
              margin:20px 0;
            ">
              <div style="color:#64748b;font-size:13px;">
                GENERATED PASSWORD
              </div>

              <div style="
                font-size:28px;
                font-weight:bold;
                color:#15803d;
                margin-top:10px;
              ">
                ${password}
              </div>
            </div>

            <div style="
              background:#ecfdf5;
              border-left:5px solid #22c55e;
              padding:15px;
              border-radius:8px;
            ">
              Please change your password after first login.
            </div>
          </div>

          <div style="
            text-align:center;
            padding:20px;
            background:#f8fafc;
          ">
            © ${new Date().getFullYear()}
            Agastya Park | Created By Paras Varankar
          </div>

        </div>
      </div>
      `,
        });

        console.log("Password Email Sent:", info.messageId);

        return info;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ===============================
// SEND OTP EMAIL
// ===============================
export async function sendOTPEmail(
    email,
    name,
    otp
) {
    try {
        const info = await transporter.sendMail({
            from: `"Agastya Park" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Agastya Park Password Reset OTP",
            html: `
      <div style="
        background:#f4f7f6;
        padding:30px;
        font-family:Arial,sans-serif;
      ">

      <div style="
        max-width:650px;
        margin:auto;
        background:white;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,.08);
      ">

      <div style="
        background:linear-gradient(135deg,#16a34a,#22c55e);
        color:white;
        text-align:center;
        padding:40px;
      ">
          <h1 style="margin:0;">
            Agastya Park
          </h1>

          <p style="margin-top:10px;">
            Devad, Panvel
          </p>
      </div>

      <div style="padding:40px;">

          <h2 style="color:#166534;">
            Hello ${name} 👋
          </h2>

          <p style="
            color:#475569;
            line-height:1.8;
          ">
            We received a request to reset your password.
            Use the OTP below to continue.
          </p>

          <div style="
            background:linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );
            padding:30px;
            border-radius:20px;
            text-align:center;
            margin:30px 0;
          ">

              <div style="
                color:white;
                font-size:14px;
                letter-spacing:2px;
                margin-bottom:15px;
              ">
                  VERIFICATION CODE
              </div>

              <div style="
                color:white;
                font-size:48px;
                font-weight:700;
                letter-spacing:12px;
              ">
                  ${otp}
              </div>

          </div>

          <div style="
            background:#f0fdf4;
            border:1px solid #bbf7d0;
            padding:20px;
            border-radius:16px;
          ">

              <strong style="
                color:#166534;
              ">
                🔒 Security Information
              </strong>

              <ul style="
                margin-top:10px;
                padding-left:20px;
                color:#475569;
                line-height:1.8;
              ">
                <li>This OTP is valid for 10 minutes.</li>
                <li>Do not share this OTP.</li>
                <li>Agastya Park never asks for OTP.</li>
              </ul>

          </div>

      </div>

      <div style="
        background:#f8fafc;
        padding:20px;
        text-align:center;
      ">
          <div style="
            color:#166534;
            font-weight:bold;
          ">
            Agastya Park
          </div>

          <div style="
            color:#64748b;
            margin-top:5px;
          ">
            Devad, Panvel
          </div>

          <div style="
            color:#94a3b8;
            margin-top:10px;
            font-size:12px;
          ">
            © ${new Date().getFullYear()}
            Agastya Park | Created By Paras Varankar
          </div>
      </div>

      </div>
      </div>
      `,
        });

        console.log("OTP Email Sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("OTP Email Error:", error);
        throw error;
    }
}