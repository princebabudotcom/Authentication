// models/Session.js

import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | USER
    |--------------------------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | REFRESH TOKEN
    |--------------------------------------------------------------------------
    */

    refreshToken: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    /*
    |--------------------------------------------------------------------------
    | SESSION STATUS
    |--------------------------------------------------------------------------
    */

    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokeReason: {
      type: String,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | DEVICE INFO
    |--------------------------------------------------------------------------
    */

    userAgent: {
      type: String,
      default: '',
    },

    ipAddress: {
      type: String,
      default: '',
    },

    device: {
      type: String,
      default: '',
    },

    browser: {
      type: String,
      default: '',
    },

    os: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | SESSION TIMING
    |--------------------------------------------------------------------------
    */

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| AUTO DELETE EXPIRED SESSIONS
|--------------------------------------------------------------------------
*/

sessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

// delete after 90 days after

sessionSchema.index(
  { revokedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { isRevoked: true } }
);

/*
|--------------------------------------------------------------------------
| CHECK ACTIVE SESSION
|--------------------------------------------------------------------------
*/

sessionSchema.methods.isActive = function () {
  return !this.isRevoked && this.expiresAt > new Date();
};

/*
|--------------------------------------------------------------------------
| REVOKE SESSION
|--------------------------------------------------------------------------
*/

sessionSchema.methods.revoke = async function (reason = 'Manual logout') {
  this.isRevoked = true;

  this.revokedAt = new Date();

  this.revokeReason = reason;

  await this.save();
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;
