import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);