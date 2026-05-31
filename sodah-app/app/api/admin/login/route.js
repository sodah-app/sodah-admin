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

    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

   const admin = await Admin.findOne({});

console.log("FOUND ADMIN:", admin);
    if (!admin) {
      return Response.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      
 NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

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