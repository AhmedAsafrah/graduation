const nodemailer = require("nodemailer");
const AppError = require("./appError");

const sendEmail = async (options) => {
  console.log("📧 Starting sendEmail function...");
  console.log("📧 Email Options:", options);
  console.log("📧 Transporter Config:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD ? "****" : "undefined",
    },
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // HTML template for the email
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.subject}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f3ff; line-height: 1.8;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 8px 20px rgba(107, 114, 128, 0.1); overflow: hidden;">
      <tr>
        <td style="background: linear-gradient(90deg, #a5b4fc, #c4b5fd); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 34px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Club Hub PPU</h1>
          <p style="color: #f3e8ff; margin: 10px 0 0; font-size: 16px; font-weight: 400; font-style: italic;">Your Gateway to Campus Life</p>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding: 0;">
          <div style="height: 1px; background: linear-gradient(90deg, transparent, #e0e7ff, transparent); margin: 0 50px;"></div>
        </td>
      </tr>
      <tr>
        <td style="padding: 50px 30px; text-align: center;">
          <h2 style="color: #1f2937; font-size: 26px; font-weight: 600; margin: 0 0 25px; letter-spacing: 0.8px;">Your Password Reset Code</h2>
          <p style="color: #4b5563; font-size: 16px; margin: 0 0 30px; max-width: 400px; margin-left: auto; margin-right: auto;">
            ${options.message.split("\n").join("<br>")}
          </p>
          <div style="background: #f9fafb; padding: 25px 35px; border-radius: 12px; display: inline-block; margin: 30px 0; box-shadow: 0 4px 12px rgba(165, 180, 252, 0.2), 0 0 0 4px rgba(196, 181, 253, 0.1);">
            <p style="color: #6d28d9; font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 5px;">
              ${
                options.message.match(/Your reset code is: (\d+)/)?.[1] || "N/A"
              }
            </p>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 25px 0 0; font-style: italic; max-width: 400px; margin-left: auto; margin-right: auto;">
            This code expires in 10 minutes. If you didn’t request a reset, please ignore this email.
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding: 0;">
          <div style="height: 1px; background: linear-gradient(90deg, transparent, #e0e7ff, transparent); margin: 0 50px;"></div>
        </td>
      </tr>
      <tr>
        <td style="background-color: #fafafa; padding: 30px 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 13px; margin: 0; font-style: italic; letter-spacing: 0.5px;">
            All rights reserved to the Deanship of Student Affairs, PPU © 2025
          </p>
          <p style="color: #6b7280; font-size: 13px; margin: 12px 0 0;">
            Questions? <a href="mailto:support@clubhubppu.com" style="color: #6d28d9; text-decoration: none; font-weight: 500;">Contact Support</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;
  const mailOptions = {
    from: `Club Hub PPU <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message, // Fallback for email clients that don't support HTML
    html: htmlContent, // HTML content for the email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    console.error("❌ Full Error Details:", error);
    throw new AppError("Error sending email", 500);
  }
};

module.exports = sendEmail;
