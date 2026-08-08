require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const UserModel = require("./models/User.models");
const ProductModel = require("./models/productSchema");

const MONGO_URI = process.env.mongoDbURL;

// ------------------------------------------------------------------
// Fixed demo credentials — put these in your README for recruiters
// ------------------------------------------------------------------
const DEMO_USERS = [
  {
    username: "seller_ananya",
    email: "ananya.seller@shopease.demo",
    password: "Seller@123",
    role: "seller",
  },
  {
    username: "seller_rohan",
    email: "rohan.seller@shopease.demo",
    password: "Seller@123",
    role: "seller",
  },
  {
    username: "buyer_demo",
    email: "buyer@shopease.demo",
    password: "Buyer@123",
    role: "buyer",
  },
];

async function run() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // 1. Clean slate for demo users + all products
  await UserModel.deleteMany({
    username: { $in: DEMO_USERS.map((u) => u.username) },
  });
  await ProductModel.deleteMany({});
  console.log("🧹 Cleared old demo users + all products");

  // 2. Create users (hash passwords)
  const createdUsers = [];
  for (const u of DEMO_USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    const user = await UserModel.create({
      username: u.username,
      email: u.email,
      password: hashed,
      role: u.role,
    });
    createdUsers.push(user);
  }

  const [seller1, seller2, buyer] = createdUsers;
  console.log("👤 Created 2 sellers + 1 buyer");

  // 3. Load 60 products and split 30/30 between the two sellers
  const productsPath = path.join(__dirname, "products.seed.json");
  const rawProducts = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  if (rawProducts.length !== 60) {
    console.warn(`⚠️  Expected 60 products, found ${rawProducts.length}`);
  }

  const productsToInsert = rawProducts.map((p, index) => ({
    name: p.name,
    price: p.price,
    Image: p.Image,
    description: p.description,
    category: p.category,
    brand: p.brand || "Generic",
    stock: p.stock,
    averageRating: p.averageRating || 0,
    totalReviews: p.totalReviews || 0,
    isActive: true,
    reviews: [], // reset — real review docs will be seeded separately
    seller: index % 2 === 0 ? seller1._id : seller2._id,
  }));

  await ProductModel.insertMany(productsToInsert);

  const seller1Count = productsToInsert.filter(
    (p) => p.seller.equals(seller1._id)
  ).length;
  const seller2Count = productsToInsert.filter(
    (p) => p.seller.equals(seller2._id)
  ).length;

  console.log(`📦 Inserted ${productsToInsert.length} products`);
  console.log(`   → ${seller1.username}: ${seller1Count} products`);
  console.log(`   → ${seller2.username}: ${seller2Count} products`);

  console.log("\n================ DEMO LOGIN CREDENTIALS ================");
  DEMO_USERS.forEach((u) =>
    console.log(`${u.role.padEnd(7)} | username: ${u.username.padEnd(15)} | password: ${u.password}`)
  );
  console.log("==========================================================\n");

  await mongoose.disconnect();
  console.log("✅ Done. Disconnected.");
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});