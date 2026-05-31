export const passwordResetEmailTemplate = ({
  fullName,
  resetPasswordLink,
  appName = 'Your App',
  expiryTime = '15 minutes',
}) => {
  return {
    subject: `Reset Your Password - ${appName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">
          
          <div style="background:#2563eb;padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;">${appName}</h1>
          </div>

          <div style="padding:40px;">
            <h2 style="margin-top:0;color:#111827;">
              Reset Your Password
            </h2>

            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Hi ${fullName},
            </p>

            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              We received a request to reset the password for your account.
              Click the button below to create a new password.
            </p>

            <div style="text-align:center;margin:35px 0;">
              <a
                href="${resetPasswordLink}"
                style="
                  background:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  display:inline-block;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              This link will expire in <strong>${expiryTime}</strong>.
            </p>

            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>

            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Thank you,<br />
              <strong>${appName} Team</strong>
            </p>
          </div>

          <div style="padding:20px;text-align:center;background:#f9fafb;color:#6b7280;font-size:12px;">
            This is an automated email. Please do not reply.
          </div>

        </div>
      </body>
      </html>
    `,
  };
};
