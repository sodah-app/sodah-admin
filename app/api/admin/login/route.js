import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } =
    await req.json();

  const adminEmail =
    process.env.ADMIN_EMAIL;

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  if (
    email !== adminEmail ||
    password !== adminPassword
  ) {
    return NextResponse.json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const response =
    NextResponse.json({
      success: true,
      token: "admin-authenticated",
      admin: {
        email,
      },
    });

  response.cookies.set(
    "adminToken",
    "admin-authenticated",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  return response;
}