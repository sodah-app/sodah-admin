import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      email,
      password,
    } = body;

    /* FIND USER */

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return Response.json(
        {
          success: false,
          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* PASSWORD CHECK */

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid password.",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================
       SUBSCRIPTION CHECK
    ========================== */

    const now =
      new Date();

    /* FREE TRIAL EXPIRED */

    if (
      user.trialEndDate &&
      now >
        new Date(
          user.trialEndDate
        )
    ) {
      user.subscriptionStatus =
        "expired";

      user.isBlocked = true;

      await user.save();

      return Response.json(
        {
          success: false,

          expired: true,

          message:
            "Your subscription has expired. Please upgrade.",
        },
        {
          status: 403,
        }
      );
    }

    /* PAID SUBSCRIPTION EXPIRED */

    if (
      user.subscriptionEndDate &&
      now >
        new Date(
          user.subscriptionEndDate
        )
    ) {
      user.subscriptionStatus =
        "expired";

      user.isBlocked = true;

      await user.save();

      return Response.json(
        {
          success: false,

          expired: true,

          message:
            "Subscription expired. Please renew.",
        },
        {
          status: 403,
        }
      );
    }

    /* ACTIVE USER */

    user.isBlocked = false;

    await user.save();

    /* REMOVE PASSWORD */

    const userResponse =
      user.toObject();

    delete userResponse.password;

    return Response.json({
      success: true,

      message:
        "Login successful.",

      user: userResponse,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,

        message:
          "Server error.",
      },
      {
        status: 500,
      }
    );
  }
}