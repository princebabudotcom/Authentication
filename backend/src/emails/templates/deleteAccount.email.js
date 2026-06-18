export const deleteAccountOtpTemplate = (fullName, otp) => {
  return {
    subject: 'Confirm Account Deletion',

    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2>Account Deletion Request</h2>

    <p>Hello ${fullName},</p>

    <p>
      We received a request to permanently delete your account.
    </p>

    <p>
      Please use the OTP below to confirm this action:
    </p>

    <div
      style="
        background:#f4f4f4;
        padding:16px;
        text-align:center;
        font-size:28px;
        font-weight:bold;
        letter-spacing:5px;
        border-radius:8px;
      "
    >
      ${otp}
    </div>

    <p style="margin-top:20px;">
      This OTP will expire in <strong>10 minutes</strong>.
    </p>

    <p>
      If you did not request account deletion, please ignore this email.
    </p>

    <p>
      For security reasons, never share this OTP with anyone.
    </p>

    <br />

    <p>Thank you,</p>
    <p><strong>Support Team</strong></p>
  </div>
`,
  };
};

export const accountDeletedTemplate = (fullName, email, deletedAt) => {
  return {
    subject: 'Account Deleted Successfully',

    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2>Account Deleted Successfully</h2>

    <p>Hello ${fullName},</p>

    <p>
      This email confirms that your account has been successfully deleted.
    </p>

    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Deleted At</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${deletedAt}</td>
      </tr>
    </table>

    <p>
      If you did not perform this action, please contact support immediately.
    </p>

    <p>
      Thank you for using our platform.
    </p>

    <br />

    <p>Regards,</p>
    <p><strong>Support Team</strong></p>
  </div>
`,
  };
};
