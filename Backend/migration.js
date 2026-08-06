// migrateExistingData.js
require("dotenv").config();
const connectdb = require('./config/db');
const ProductModel = require("./models/productSchema");
const ReviewModel = require("./models/Review.models");
const UserModel = require("./models/User.models");
const OrderModel = require("./models/Order.model");

connectdb();

async function migrate() {
    // 1. Find a seller to assign to old products (pick first seller, or create a fallback)
    let fallbackSeller = await UserModel.findOne({ role: "seller" });
    if (!fallbackSeller) {
        console.log("No seller found — creating a fallback 'legacy-seller' user");
        fallbackSeller = await UserModel.create({
            username: "legacy_seller",
            email: "legacy@shopease.com",
            password: "migrated_no_login", // not meant to be logged into
            role: "seller"
        });
    }

    // 2. Backfill Product fields
    const products = await ProductModel.find({});
    for (const p of products) {
        const updates = {};
        if (!p.category) updates.category = "Accessories"; // safe default, review manually after
        if (!p.brand) updates.brand = "Generic";
        if (p.stock === undefined) updates.stock = 50;
        if (!p.seller) updates.seller = fallbackSeller._id;
        if (p.isActive === undefined) updates.isActive = true;

        // 3. Compute averageRating + totalReviews from existing reviews
        const reviews = await ReviewModel.find({ _id: { $in: p.reviews } });
        updates.totalReviews = reviews.length;
        updates.averageRating = reviews.length
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
            : 0;

        // 4. Backfill review.product ref (reviews didn't have this before)
        await ReviewModel.updateMany(
            { _id: { $in: p.reviews } },
            { $set: { product: p._id } }
        );

        // 5. Backfill verifiedPurchase for those reviews
        const productReviews = await ReviewModel.find({ product: p._id });
        for (const r of productReviews) {
            const hasOrder = await OrderModel.exists({ userId: r.user, productId: p._id });
            if (hasOrder && !r.verifiedPurchase) {
                r.verifiedPurchase = true;
                await r.save();
            }
        }

        await ProductModel.updateOne({ _id: p._id }, { $set: updates });
        console.log(`Migrated: ${p.name}`);
    }

    console.log("Migration complete.");
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});