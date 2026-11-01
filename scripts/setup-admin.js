import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ilmora";
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  const User = mongoose.connection.collection("users");
  
  // পুরনো অ্যাডমিন থাকলে ডিলিট করা (যাতে নতুনটা কনফ্লিক্ট না করে)
  await User.deleteMany({ role: "SUPERADMIN" });

  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const fullName = process.env.SUPERADMIN_NAME || "Library Owner";

  if (!email || !password) {
    console.error("❌ .env.local ফাইলে SUPERADMIN_EMAIL বা SUPERADMIN_PASSWORD নেই!");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.insertOne({
    fullName,
    email: email.toLowerCase(),
    phone: "",
    address: "",
    passwordHash,
    role: "SUPERADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("✅ Super Admin successfully created in Database!");
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
