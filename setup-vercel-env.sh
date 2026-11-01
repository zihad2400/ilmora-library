#!/bin/bash

echo "🚀 Starting Vercel Environment Variables Setup..."

# MongoDB URI
echo "mongodb+srv://ilmora-library:ilmora%2Dlibrary@ilmora-library.bpawc2t.mongodb.net/ilmora?retryWrites=true&w=majority" | vercel env add MONGODB_URI production

# NextAuth Secret
echo "ilmora-super-secret-key-2026" | vercel env add NEXTAUTH_SECRET production

# NextAuth URL (আপনার ডেপ্লয় হওয়া লিংকটি পরে আপডেট করে নিতে পারবেন)
echo "https://ilmora-library.vercel.app" | vercel env add NEXTAUTH_URL production

# Superadmin Info
echo "Zihad Bin Samsu" | vercel env add SUPERADMIN_NAME production
echo "zihadbinsamsu2400@gmail.com" | vercel env add SUPERADMIN_EMAIL production
echo "admin123" | vercel env add SUPERADMIN_PASSWORD production

echo "✅ Environment Variables Setup Complete!"
