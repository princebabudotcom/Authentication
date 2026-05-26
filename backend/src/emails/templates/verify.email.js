const verifyEmailTemplate = ({ fullName, otp }) => {
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

      <h1
        style="
          color: #111827;
          margin-bottom: 20px;
        "
      >
        Verify Your Email
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
        Please use the verification code below
        to verify your email address.
      </p>

      <div
        style="
          margin: 32px 0;
          text-align: center;
        "
      >

        <span
          style="
            display: inline-block;
            padding: 16px 32px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            background: #111827;
            color: #ffffff;
            border-radius: 12px;
          "
        >
          ${otp}
        </span>

      </div>

      <p
        style="
          color: #6b7280;
          font-size: 14px;
          line-height: 1.7;
        "
      >
        This OTP will expire in 5 minutes.
      </p>

      <p
        style="
          color: #6b7280;
          font-size: 14px;
          line-height: 1.7;
        "
      >
        If you did not request this,
        please ignore this email.
      </p>

    </div>
  `;
};

export default verifyEmailTemplate;
