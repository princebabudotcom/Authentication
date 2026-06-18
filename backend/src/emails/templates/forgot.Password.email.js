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

export const passwordChangedEmailTemplate = (fullName) => {
  const changedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return {
    subject: 'Security Alert: Your Password Was Changed',

    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Changed</title>
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding: 30px 15px;"
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background: #2563eb;
                      padding: 30px;
                      color: #ffffff;
                    "
                  >
                    <h1 style="margin: 0; font-size: 24px;">
                      Password Changed Successfully
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 35px;">
                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 16px;
                        color: #333333;
                      "
                    >
                      Hello <strong>${fullName}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 15px;
                        color: #555555;
                        line-height: 1.7;
                      "
                    >
                      This email confirms that the password for your account
                      was successfully changed.
                    </p>

                    <div
                      style="
                        background: #f8fafc;
                        border-left: 4px solid #2563eb;
                        padding: 16px;
                        margin: 24px 0;
                        border-radius: 6px;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #333333;
                          font-size: 14px;
                        "
                      >
                        <strong>Date & Time:</strong> ${changedAt}
                      </p>
                    </div>

                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 15px;
                        color: #555555;
                        line-height: 1.7;
                      "
                    >
                      If you made this change, no further action is required.
                    </p>

                    <div
                      style="
                        background: #fef2f2;
                        border-left: 4px solid #dc2626;
                        padding: 16px;
                        border-radius: 6px;
                        margin-top: 20px;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #b91c1c;
                          font-size: 14px;
                          line-height: 1.7;
                        "
                      >
                        <strong>Didn't change your password?</strong><br />
                        Your account may be at risk. Please reset your password
                        immediately and contact support if you believe your
                        account has been compromised.
                      </p>
                    </div>

                    <p
                      style="
                        margin-top: 30px;
                        font-size: 15px;
                        color: #555555;
                      "
                    >
                      Regards,<br />
                      <strong>Security Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background: #f8fafc;
                      padding: 20px;
                      text-align: center;
                      color: #6b7280;
                      font-size: 12px;
                    "
                  >
                    This is an automated security notification. Please do not
                    reply to this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
};
