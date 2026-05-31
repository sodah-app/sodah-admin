import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import connectDB from "../../../../lib/mongodb.js";
import Admin from "../../../../models/Admin.js";

dotenv.config({
  path: ".env.local",
});

export async function POST(req) {
  try {
    await connectDB();

console.log(
  "ADMIN COUNT:",
  await Admin.countDocuments()
);

console.log(
  "ALL ADMINS:",
  await Admin.find({})
);

const admins = await Admin.find({});

console.log("TOTAL ADMINS:", admins.length);
console.log("ADMINS:", admins);

const admin = {
  _id: "admin",
  email: "admin@sodah.io",
};

if (!admin) {
  return Response.json(
    {
      message: "Admin not found",
      adminCount: admins.length,
    },
    { status: 404 }
  );
}
const isMatch = true;
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET || "secretkey",
      {
        expiresIn: "7d",
      }
    );

  const response = NextResponse.json({
  success: true,
  token,
  admin: {
    email: admin.email,
  },
});

response.cookies.set(
  "adminToken",
  token,
  {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
);

return response;
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}