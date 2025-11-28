const express = require("express");
const router = express.Router();
const OrderModel = require("../models/Order.model");
const api = require("../utils/api");


router.get("/history", async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await OrderModel.find({ userId }).populate("productId");

   return api.success(res,orders,"")
  } catch (err) {
    return api.error(res,err);
  }
});

module.exports = router;