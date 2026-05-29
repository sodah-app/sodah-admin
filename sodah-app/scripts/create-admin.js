import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Admin from "../models/Admin.js";

const MONGO_URI =
  process.env.MONGODB_URI;

async function createAdmin() {
  try {
    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    const existingAdmin =
      await Admin.findOne({
        email:
          "admin@sodah.io",
      });

    if (existingAdmin) {
      console.log(
        "Admin already exists."
      );

      process.exit();
    }

    /* HASH PASSWORD */

    const hashedPassword =
      await bcrypt.hash(
        "SodahAdmin123",
        10
      );

    /* CREATE ADMIN */

    const admin =
      await Admin.create({
        email:
          "admin@sodah.io",

        password:
          hashedPassword,
      });

    console.log(
      "Admin created:"
    );

    console.log(admin);

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

createAdmin();