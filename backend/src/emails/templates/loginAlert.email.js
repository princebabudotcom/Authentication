// login-alert.template.js

const loginAlertTemplate = ({ fullName, email, ip, agent, loginTime }) => {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 24px;
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      "
    >

      <h1
        style="
          color: #111827;
          margin-bottom: 20px;
        "
      >
        New Login Detected
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
        We detected a new login to your account.
        If this was you, no action is required.
      </p>

      <div
        style="
          margin-top: 24px;
          padding: 18px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        "
      >

        <p>
          <strong>Email:</strong>
          ${email}
        </p>

        <p>
          <strong>IP Address:</strong>
          ${ip}
        </p>

        <p>
          <strong>Device / Browser:</strong>
          ${agent}
        </p>

        <p>
          <strong>Login Time:</strong>
          ${loginTime}
        </p>

      </div>

      <div
        style="
          margin-top: 24px;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
        "
      >

        <p
          style="
            color: #991b1b;
            font-size: 14px;
            line-height: 1.7;
            margin: 0;
          "
        >
          If you do not recognize this login,
          please reset your password immediately
          and revoke active sessions.
        </p>

      </div>

    </div>
  `;
};

export default loginAlertTemplate;
