import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'],
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      index: true,
    },

    password: {
      type: String,
      required: [
        function () {
          return !this.googleId && !this.githubId;
        },
        'Password is required',
      ],
      minlength: 8,
      select: false,
    },

    avatar: {
      url: {
        type: String,
        default: '',
      },
      fileId: {
        type: String,
        default: '',
      },
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      select: false,
      required: function () {
        return !this.githubId && !this.password;
      },
    },

    githubId: {
      type: String,
      select: false,
      required: function () {
        return !this.googleId && !this.password;
      },
    },

    refreshToken: {
      type: String,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordResetRequestAt: {
      type: Date,
      select: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    emailVerificationSentAt: {
      type: Date,
      select: false,
    },
    emailVerificationAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },

    lastLogin: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

/*
|--------------------------------------------------------------------------
| HASH PASSWORD BEFORE SAVE
|--------------------------------------------------------------------------
*/

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
|--------------------------------------------------------------------------
| COMPARE PASSWORD
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/*
|--------------------------------------------------------------------------
| GENERATE ACCESS TOKEN
|--------------------------------------------------------------------------
*/

userSchema.methods.generateAccessToken = function (sessionId) {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email,
      username: this.username,
      sessionId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    }
  );
};

/*
|--------------------------------------------------------------------------
| GENERATE REFRESH TOKEN
|--------------------------------------------------------------------------
*/

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    }
  );
};

/*
|--------------------------------------------------------------------------
| CHECK ACCOUNT LOCK
|--------------------------------------------------------------------------
*/

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/*
|--------------------------------------------------------------------------
| REMOVE SENSITIVE DATA
|--------------------------------------------------------------------------
*/

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.refreshToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
