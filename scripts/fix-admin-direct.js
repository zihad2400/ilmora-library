import mongoose from "mongoose";
import bcrypt from "bcryptjs";

async function run() {
  const MONGODB_URI = "mongodb://127.0.0.1:27017/ilmora";
  await mongoose.connect(MONGODB_URI);
  console.log("🔌 Connected to MongoDB");

  const User = mongoose.connection.collection("users");
  
  // আগের সব ইউজার ডিলিট করে নতুন করে অ্যাডমিন বানানো
  const email = "zihadbinsamsu2400@gmail.com";
  const password = "admin123";
  
  await User.deleteMany({ email: email }); // আগেরটা থাকলে মুছে ফেলবে
  await User.deleteMany({ role: "SUPERADMIN" }); // অন্য কোনো অ্যাডমিন থাকলে তাও মুছে ফেলবে

  const passwordHash = await bcrypt.hash(password, 12);

  await User.insertOne({
    fullName: "Zihad Bin Samsu",
    email: email,
    phone: "",
    address: "",
    passwordHash: passwordHash,
    role: "SUPERADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("✅ Admin created directly in DB without .env issues!");
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
