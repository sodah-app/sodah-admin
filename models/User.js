import mongoose from "mongoose";

const UserSchema =
  new mongoose.Schema(
    {
      /* USER INFO */

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      /* SUBSCRIPTION */

      subscriptionStatus: {
        type: String,

        enum: [
          "trial",
          "active",
          "expired",
        ],

        default: "trial",
      },

      plan: {
        type: String,

        default:
          "7-days-trial",
      },

      trialStartDate: {
        type: Date,

        default: Date.now,
      },

      trialEndDate: {
        type: Date,
      },

      subscriptionStartDate: {
        type: Date,
      },

      subscriptionEndDate: {
        type: Date,
      },

      /* BLOCK ACCESS */

      isBlocked: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

/* AUTO CREATE 7 DAYS TRIAL */

UserSchema.pre(
  "save",
  function (next) {
    if (!this.trialEndDate) {
      const trial =
        new Date();

      trial.setDate(
        trial.getDate() + 7
      );

      this.trialEndDate =
        trial;
    }

    next();
  }
);

export default
  mongoose.models.User ||
  mongoose.model(
    "User",
    UserSchema
  );