const emailVerifiedTemplate = ({ fullName }) => {
  return `

    <div
      style="
        max-width: 600px;
        margin: auto;
        padding: 32px;
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        font-family: Arial, sans-serif;
      "
    >

      <div
        style="
          text-align: center;
          margin-bottom: 24px;
        "
      >

        <div
          style="
            width: 72px;
            height: 72px;
            margin: auto;
            background: #dcfce7;
            border-radius: 50%;
            line-height: 72px;
            font-size: 36px;
          "
        >
          ✅
        </div>

      </div>

      <h1
        style="
          color: #111827;
          text-align: center;
          margin-bottom: 20px;
        "
      >
        Email Verified Successfully
      </h1>

      <p
        style="
          color: #4b5563;
          font-size: 15px;
          line-height: 1.7;
        "
      >
        Hi <strong>${fullName}</strong>,
      </p>

      <p
        style="
          color: #4b5563;
          font-size: 15px;
          line-height: 1.7;
        "
      >
        Your email address has been verified successfully.
        You now have full access to your account features.
      </p>

      <div
        style="
          margin-top: 32px;
          padding: 18px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        "
      >

        <p
          style="
            margin: 0;
            color: #374151;
            font-size: 14px;
            line-height: 1.7;
          "
        >
          If you did not perform this action,
          please secure your account immediately.
        </p>

      </div>

      <p
        style="
          margin-top: 32px;
          color: #9ca3af;
          font-size: 13px;
          text-align: center;
        "
      >
        This is an automated security email.
      </p>

    </div>
  `;
};

export default emailVerifiedTemplate;
