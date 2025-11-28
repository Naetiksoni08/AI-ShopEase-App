const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const api = require("../utils/api");
const crypto = require("crypto");
const UserModel = require("../models/User.models");
const OrderModel = require("../models/Order.model");
const { auth } = require("../middlewares/auth");


const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;


const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});



router.post("/order", auth, async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const options = {
            amount: amount * 100,
            currency: currency || "INR",
            receipt: "order_rcptid_11",
        }

        const order = await instance.orders.create(options);

        api.success(res, order);

    } catch (error) {
        api.error(res, error, "Something Went Wrong");

    }

})



router.post("/verify", auth, async (req, res) => {
    try {

        const { productId, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        const signature = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedsign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(signature.toString())
            .digest("hex");

        if (expectedsign !== razorpay_signature) {
            return api.error(res, null, "Payment verification failed", 400);
        }


        const userId = req.user.id;
        
        const user = await UserModel.findById(userId);
        if (!user) return api.error(res, null, "User not found", 404);

        user.cart = user.cart.filter(id => id.toString() !== productId);
        await user.save();

        await OrderModel.create({
            userId:userId,
            productId,
            amount,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        })

        return api.success(res, null, "Payment Success, Product Removed From Cart");

    } catch (err) {
        return api.error(res, err);
    }

})

module.exports = router;