# Backend Authentication & Authorization Flow (JWT Access + Refresh Token)

## Overview

This README explains a complete backend authentication and authorization system using:

- JWT Access Tokens
- JWT Refresh Tokens
- HTTP-only Cookies
- Role-based Authorization
- Secure Authentication Flow
- Token Rotation
- Protected Routes

This flow is commonly used in production-level applications.

---

# Tech Stack

## Runtime

- Node.js
- Express.js

## Database

- MongoDB + Mongoose

## Authentication Packages

| Package                                         | Purpose                        |
| ----------------------------------------------- | ------------------------------ |
| `jsonwebtoken`                                  | Generate and verify JWT tokens |
| `bcryptjs`                                      | Password hashing               |
| `cookie-parser`                                 | Read cookies                   |
| `dotenv`                                        | Environment variables          |
| `mongoose`                                      | MongoDB ODM                    |
| `cors`                                          | Cross-origin requests          |
| `express-async-handler` OR custom async handler | Error handling                 |
| `helmet`                                        | Security headers               |
| `morgan`                                        | Request logging                |
| `express-rate-limit`                            | Rate limiting                  |

---

# Install Packages

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors helmet morgan express-rate-limit
```

Optional:

```bash
npm install nodemon --save-dev
```

---

# Folder Structure

```bash
src/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── auth.controller.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── asyncHandler.js
│
├── models/
│   └── user.model.js
│
├── routes/
│   └── auth.routes.js
│
├── services/
│   └── token.service.js
│
├── utils/
│   └── ApiError.js
│
├── app.js
└── server.js
```

---

# Authentication vs Authorization

## Authentication

Authentication means:

> "Who are you?"

The server verifies the user's identity.

Example:

- Login with email/password
- Verify JWT token

---

## Authorization

Authorization means:

> "What are you allowed to do?"

The server checks permissions or roles.

Example:

- Admin can delete users
- Normal users cannot

---

# Token Types

## 1. Access Token

Short-lived token.

Used to access protected APIs.

Example expiry:

```txt
15 minutes
```

Contains:

```json
{
  "id": "user_id",
  "role": "user"
}
```

---

## 2. Refresh Token

Long-lived token.

Used to generate new access tokens.

Example expiry:

```txt
7 days
```

Stored securely in:

- Database
- HTTP-only cookie

---

# Full Authentication Flow

## Step 1 — User Registers

User sends:

```json
{
  "name": "Prince",
  "email": "prince@gmail.com",
  "password": "123456"
}
```

Server:

1. Validates data
2. Hashes password using bcrypt
3. Saves user to database

---

## Step 2 — User Logs In

User sends:

```json
{
  "email": "prince@gmail.com",
  "password": "123456"
}
```

Server:

1. Finds user
2. Compares password
3. Generates:
   - Access token
   - Refresh token

4. Sends tokens

---

# Token Generation Flow

## Access Token

```js
jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: "15m",
  },
);
```

---

## Refresh Token

```js
jwt.sign(
  {
    id: user._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: "7d",
  },
);
```

---

# Recommended Token Storage

## Access Token

Store in:

```txt
Memory / Frontend State
```

Do NOT store permanently in localStorage for highly secure apps.

---

## Refresh Token

Store in:

```txt
HTTP-only Cookie
```

Why?

- JavaScript cannot access it
- Prevents XSS attacks

---

# Login Response Example

```json
{
  "success": true,
  "accessToken": "jwt_access_token",
  "user": {
    "id": "123",
    "name": "Prince",
    "role": "user"
  }
}
```

Refresh token goes in cookie.

---

# Cookie Configuration

```js
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

---

# Protected Route Flow

## Client Request

```http
GET /api/profile
Authorization: Bearer access_token
```

---

## Middleware Verification

```js
const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
```

If valid:

```js
req.user = decoded;
next();
```

If invalid:

```txt
401 Unauthorized
```

---

# Authorization Middleware

## Example

```js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};
```

---

# Example Usage

## Only Admin Access

```js
router.delete("/delete-user", protect, authorize("admin"), deleteUser);
```

---

# Refresh Token Flow

## Problem

Access token expires quickly.

User should not login repeatedly.

---

## Solution

Use refresh token.

---

# Refresh Endpoint

```http
POST /api/auth/refresh-token
```

Server:

1. Reads refresh token from cookie
2. Verifies refresh token
3. Generates new access token
4. Sends new access token

---

# Refresh Flow Diagram

```txt
Login
   ↓
Access Token + Refresh Token
   ↓
Access Token Expires
   ↓
Client calls Refresh API
   ↓
Server verifies Refresh Token
   ↓
New Access Token Generated
```

---

# Logout Flow

## Logout Endpoint

```http
POST /api/auth/logout
```

Server:

1. Removes refresh token from DB
2. Clears cookie

```js
res.clearCookie("refreshToken");
```

---

# Password Hashing

## Hash Password

```js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

---

## Compare Password

```js
const isMatch = await bcrypt.compare(password, user.password);
```

---

# User Model Example

```js
const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    refreshToken: String,
  },
  {
    timestamps: true,
  },
);
```

---

# Authentication Middleware

```js
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
```

---

# Route Example

```js
router.get("/profile", protect, getProfile);
```

---

# Environment Variables

## `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_url

ACCESS_TOKEN_SECRET=super_access_secret

REFRESH_TOKEN_SECRET=super_refresh_secret

ACCESS_TOKEN_EXPIRE=15m

REFRESH_TOKEN_EXPIRE=7d
```

---

# Recommended Security Practices

## Use HTTPS

Always use HTTPS in production.

---

## Use HTTP-only Cookies

Prevents JavaScript access.

---

## Use Secure Cookies

```js
secure: true;
```

Only works on HTTPS.

---

## Short Access Token Expiry

Recommended:

```txt
10m–15m
```

---

## Rotate Refresh Tokens

Generate new refresh token on refresh request.

Old refresh token becomes invalid.

---

## Store Refresh Tokens in DB

Allows:

- Logout from all devices
- Token revocation
- Better security

---

# Common Status Codes

| Status | Meaning      |
| ------ | ------------ |
| 200    | Success      |
| 201    | Created      |
| 400    | Bad Request  |
| 401    | Unauthorized |
| 403    | Forbidden    |
| 404    | Not Found    |
| 500    | Server Error |

---

# Complete API Flow

## Register

```http
POST /api/auth/register
```

---

## Login

```http
POST /api/auth/login
```

Returns:

- Access Token
- Refresh Cookie

---

## Protected Route

```http
GET /api/user/profile
```

Requires:

```txt
Bearer Access Token
```

---

## Refresh Access Token

```http
POST /api/auth/refresh-token
```

Uses:

```txt
Refresh Token Cookie
```

---

## Logout

```http
POST /api/auth/logout
```

Clears:

- Refresh cookie
- Stored refresh token

---

# Production-Level Improvements

## Add Email Verification

Verify user email before login.

---

## Add Forgot Password Flow

Using:

- OTP
- Email token

---

## Add Multi-device Sessions

Store multiple refresh tokens.

---

## Add Redis

Store blacklisted tokens.

---

## Add Rate Limiting

Prevent brute-force attacks.

---

# Common Mistakes

## Storing Password Without Hashing

Never store plain passwords.

---

## Long Access Token Expiry

Risk increases if token leaks.

---

## Using Same Secret for Both Tokens

Use separate secrets.

---

## Storing Refresh Token in localStorage

Unsafe for secure apps.

---

# Recommended Authentication Architecture

```txt
Frontend
   ↓
Login API
   ↓
Backend verifies credentials
   ↓
Generate Access Token
Generate Refresh Token
   ↓
Access Token → Frontend
Refresh Token → HTTP-only Cookie
   ↓
Protected APIs use Access Token
   ↓
Expired?
   ↓
Refresh Token API
   ↓
New Access Token
```

---

# Best Practice Summary

| Feature          | Recommendation   |
| ---------------- | ---------------- |
| Access Token     | Short expiry     |
| Refresh Token    | Long expiry      |
| Refresh Storage  | HTTP-only cookie |
| Passwords        | bcrypt hash      |
| Protected Routes | Middleware       |
| Authorization    | Role-based       |
| HTTPS            | Required         |
| Token Rotation   | Recommended      |

---

# Final Notes

This authentication flow is suitable for:

- MERN Stack Apps
- SaaS Applications
- Admin Dashboards
- Enterprise APIs
- Mobile Apps
- Production Systems

Main goals:

- Secure login
- Stateless authentication
- Session management
- Scalable authorization
- Better security against token theft and XSS attacks
