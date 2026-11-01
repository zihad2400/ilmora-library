// Usage: node scripts/seed-admin.js
// Creates the ONLY Super Admin if none exists. Refuses if one already exists.
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";

async function main() {
  await mongoose.connect(MONGODB_URI);

  const User = mongoose.connection.collection("users");

  const existing = await User.findOne({ role: "SUPERADMIN" });
  if (existing) {
    console.log("⚠️  A Super Admin already exists:", existing.email);
    process.exit(0);
  }

  const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;
  if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
    console.error("❌ Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(SUPERADMIN_PASSWORD, 12);

  await User.insertOne({
    fullName: SUPERADMIN_NAME || "Library Owner",
    email: SUPERADMIN_EMAIL.toLowerCase(),
    phone: "",
    address: "",
    passwordHash,
    role: "SUPERADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("✅ Super Admin created:", SUPERADMIN_EMAIL);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
