import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    // CONNECT DATABASE
    await connectDB();

    // GET DATA
    const { email, password } =
      await req.json();

    // VALIDATION
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please fill in your details.",
        },
        {
          status: 400,
        }
      );
    }

    // FIND USER
    const user = await User.findOne({
      email,
    });

    // USER NOT FOUND
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    // INVALID PASSWORD
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid password",
        },
        {
          status: 401,
        }
      );
    }

    // CHECK TRIAL STATUS
    const today = new Date();

    if (
      user.trialEndDate &&
      today > new Date(user.trialEndDate)
    ) {
      // UPDATE STATUS
      user.subscriptionStatus =
        "expired";

      await user.save();

      return NextResponse.json(
        {
          success: false,

          expired: true,

          message:
            "Your free trial has expired. Please subscribe to continue.",
        },
        {
          status: 403,
        }
      );
    }

    // REMAINING DAYS
    let remainingDays = 0;

    if (user.trialEndDate) {
      remainingDays = Math.ceil(
        (
          new Date(user.trialEndDate) -
          today
        ) /
          (1000 * 60 * 60 * 24)
      );
    }

    // SUCCESS LOGIN
    return NextResponse.json({
      success: true,

      message: "Login successful",

      remainingDays,

      subscriptionStatus:
        user.subscriptionStatus,

      trialEndDate:
        user.trialEndDate,

      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}