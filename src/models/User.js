import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ROLES = ["SUPERADMIN", "READER"];

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "READER", index: true },
    readerId: { type: String, unique: true, sparse: true, index: true },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "PENDING"],
      default: "ACTIVE",
    },
    avatarUrl: { type: String, default: "" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.ROLES = ROLES;

export default mongoose.models.User || mongoose.model("User", userSchema);
