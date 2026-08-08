/**
 * seedReviewsAndOrders.js
 * -----------------------------------------------------------------------
 * Run this AFTER seed.js (products + sellers/buyer must already exist).
 *
 * What it does:
 *   1. Creates 5 fake reviewer users (buyer role) — these are ONLY for
 *      populating realistic reviewer names, not meant to be login demo
 *      accounts (no need to put them in the README).
 *   2. Picks a random subset of products and creates real Orders for
 *      buyer_demo + the fake reviewers — this backs the "verifiedPurchase"
 *      flag exactly the way your CreateReview controller checks it
 *      (OrderModel.exists({ userId, productId })).
 *   3. Generates 0-6 reviews per product from a realistic text pool,
 *      rating weighted toward 4-5 stars (occasional 3, rare 1-2).
 *   4. Recalculates averageRating/totalReviews using the exact same
 *      logic as your Review.controller.js recalculateProductRating().
 *
 * Idempotent: clears existing Reviews + Orders and resets product
 * review fields before reseeding, so you can re-run safely.
 *
 * Run:
 *   node seedReviewsAndOrders.js
 * -----------------------------------------------------------------------
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserModel = require("./models/User.models");
const ProductModel = require("./models/productSchema");
const ReviewModel = require("./models/Review.models");
const OrderModel = require("./models/Order.model");

const MONGO_URI = process.env.mongoDbURL;

// ------------------------------------------------------------------
// Fake reviewer identities — NOT login demo accounts, just for names
// ------------------------------------------------------------------
const FAKE_REVIEWERS = [
  { username: "priya_kapoor", email: "priya.k@shopease.demo" },
  { username: "arjun_mehta", email: "arjun.m@shopease.demo" },
  { username: "meera_shah", email: "meera.s@shopease.demo" },
  { username: "rahul_verma", email: "rahul.v@shopease.demo" },
  { username: "sana_iyer", email: "sana.i@shopease.demo" },
];
const FAKE_PASSWORD = "ReviewerOnly@123"; // not shared with anyone, not a real login

const REVIEW_TEXTS = {
  positive: [
    "Exceeded my expectations, great build quality for the price.",
    "Exactly as described, fast delivery and well packaged.",
    "Really happy with this purchase, would buy again.",
    "Solid quality, works perfectly and looks even better in person.",
    "Great value for money, using it daily without any issues.",
    "Impressed with the finish and attention to detail.",
    "Does exactly what it promises, no complaints at all.",
    "Very satisfied, this is my second order from this seller.",
    "Comfortable, durable, and looks premium.",
    "Perfect fit for what I needed, highly recommend.",
  ],
  neutral: [
    "Decent product overall, does the job but nothing extraordinary.",
    "Good for the price, though I expected slightly better packaging.",
    "Works fine, delivery took a bit longer than expected.",
    "It's okay, matches the description but quality is average.",
  ],
  negative: [
    "Not quite what I expected, quality could be better.",
    "Had some minor issues out of the box, customer support helped though.",
  ],
};

function pickRating() {
  const r = Math.random();
  if (r < 0.55) return 5;
  if (r < 0.8) return 4;
  if (r < 0.93) return 3;
  if (r < 0.98) return 2;
  return 1;
}

function pickTextForRating(rating) {
  const pool =
    rating >= 4
      ? REVIEW_TEXTS.positive
      : rating === 3
      ? REVIEW_TEXTS.neutral
      : REVIEW_TEXTS.negative;
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function recalculateProductRating(productId) {
  const reviews = await ReviewModel.find({ product: productId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? Number(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      )
    : 0;
  await ProductModel.findByIdAndUpdate(productId, { averageRating, totalReviews });
}

async function run() {
  if (!MONGO_URI) {
    console.error("❌ mongoDbURL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // 1. Clean slate for reviews/orders + reset product review fields
  await ReviewModel.deleteMany({});
  await OrderModel.deleteMany({});
  await ProductModel.updateMany(
    {},
    { $set: { reviews: [], averageRating: 0, totalReviews: 0 } }
  );
  await UserModel.deleteMany({
    username: { $in: FAKE_REVIEWERS.map((r) => r.username) },
  });
  console.log("🧹 Cleared old reviews, orders, and reset product ratings");

  // 2. Create fake reviewer users
  const hashedFakePassword = await bcrypt.hash(FAKE_PASSWORD, 10);
  const createdReviewers = [];
  for (const r of FAKE_REVIEWERS) {
    const user = await UserModel.create({
      username: r.username,
      email: r.email,
      password: hashedFakePassword,
      role: "buyer",
    });
    createdReviewers.push(user);
  }
  console.log(`👤 Created ${createdReviewers.length} fake reviewer identities`);

  // 3. Get the real demo buyer + all reviewer pool
  const buyerDemo = await UserModel.findOne({ username: "buyer_demo" });
  if (!buyerDemo) {
    console.error("❌ buyer_demo not found — run seed.js first!");
    process.exit(1);
  }
  const reviewerPool = [buyerDemo, ...createdReviewers];

  // 4. Get all products
  const products = await ProductModel.find({});
  if (products.length === 0) {
    console.error("❌ No products found — run seed.js first!");
    process.exit(1);
  }

  // 5. Create verified-purchase Orders for ~40% of products
  const shuffledForOrders = shuffle(products);
  const orderCount = Math.floor(products.length * 0.4);
  const productsWithOrders = shuffledForOrders.slice(0, orderCount);

  // Track (userId-productId) pairs that have a verified order
  const verifiedPairs = new Set();

  for (const product of productsWithOrders) {
    // buyer_demo has a higher chance of being the purchaser
    const buyer =
      Math.random() < 0.5
        ? buyerDemo
        : reviewerPool[Math.floor(Math.random() * reviewerPool.length)];

    await OrderModel.create({
      userId: buyer._id,
      productId: product._id,
      quantity: 1,
      amount: product.price,
      razorpay_order_id: `order_demo_${product._id.toString().slice(-6)}`,
      razorpay_payment_id: `pay_demo_${product._id.toString().slice(-6)}`,
      razorpay_signature: `sig_demo_${product._id.toString().slice(-6)}`,
    });

    verifiedPairs.add(`${buyer._id}-${product._id}`);
  }
  console.log(`🧾 Created ${productsWithOrders.length} verified-purchase orders`);

  // 6. Generate reviews per product
  let totalReviewsCreated = 0;

  for (const product of products) {
    const reviewCount = Math.floor(Math.random() * 7); // 0-6 reviews
    if (reviewCount === 0) continue;

    const reviewers = shuffle(reviewerPool).slice(
      0,
      Math.min(reviewCount, reviewerPool.length)
    );

    const reviewIds = [];
    for (const reviewer of reviewers) {
      const rating = pickRating();
      const verifiedPurchase = verifiedPairs.has(
        `${reviewer._id}-${product._id}`
      );

      const review = await ReviewModel.create({
        text: pickTextForRating(rating),
        rating,
        user: reviewer._id,
        product: product._id,
        verifiedPurchase,
      });

      reviewIds.push(review._id);
      totalReviewsCreated++;
    }

    product.reviews.push(...reviewIds);
    await product.save();

    await recalculateProductRating(product._id);
  }

  console.log(`⭐ Created ${totalReviewsCreated} reviews across ${products.length} products`);
  console.log("📊 Recalculated averageRating/totalReviews for all products");

  await mongoose.disconnect();
  console.log("✅ Done. Disconnected.");
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});