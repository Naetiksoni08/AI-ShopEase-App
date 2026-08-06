// fixMissingFields.js
require("dotenv").config();
const connectdb = require('./config/db');
const ProductModel = require("./models/productSchema");

connectdb();

async function fix() {
    const result = await ProductModel.updateMany(
        { isActive: { $exists: false } },
        {
            $set: {
                isActive: true,
                stock: 50,
                brand: "Generic"
            }
        }
    );
    console.log(`Fixed ${result.modifiedCount} products`);
    process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });