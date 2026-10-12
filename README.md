# Off Road Connection Parts - E-Commerce Platform

A production-ready, ultra-fast Next.js 15 e-commerce platform for genuine car spare parts and 4x4 accessories.

## Features

- ⚡ **Next.js 15 App Router**: Server-side rendering and static optimization for peak speed.
- 🗄️ **MongoDB Atlas Cloud Database**: Scalable NoSQL cloud database storing products, categories, orders, customers, and pincodes.
- ☁️ **Cloudinary CDN**: High-speed global image delivery and auto-optimization (`f_auto,q_auto`).
- 💳 **Razorpay Payment Gateway**: UPI, Credit/Debit Cards, NetBanking, and Wallets with HMAC SHA-256 signature verification + Cash on Delivery (COD).
- 📱 **Mobile OTP Customer Authentication**: Phone-based passwordless login and account management.
- 📍 **Pincode Delivery Estimator**: Real-time serviceability check, delivery time calculation, and express shipping indicator.
- 📊 **Analytics Ready**: Meta Pixel (`fbq`) and Google Analytics 4 (`gtag`) with full e-commerce events (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`).
- 🎨 **100% Original Design**: Preserves original automotive layout, colors (`#FF6B00`, `#111111`), and typography.

---

## Cloudflare Pages Deployment Guide

### Option 1: Direct Cloudflare Pages Git Integration (Recommended)
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Compute (Workers & Pages)** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
2. Select your repository: `suhaibusmani0-lang/offroadconnection`.
3. Configure Build Settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Deploy Command**: `npx wrangler deploy`
4. Add **Environment Variables** in Cloudflare Pages dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `CLOUDINARY_CLOUD_NAME`: `coui9wpl`
   - `CLOUDINARY_API_KEY`: `849272247247994`
   - `CLOUDINARY_API_SECRET`: `ru3Gvn9lOcMvBrLqeLuSqgucvkI`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: `coui9wpl`
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `JWT_SECRET`: A secure random string
   - `NEXT_PUBLIC_GA_ID`: Your Google Analytics ID
   - `NEXT_PUBLIC_META_PIXEL_ID`: Your Meta Pixel ID
5. Click **Save and Deploy**.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure .env.local
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
npm start
```

