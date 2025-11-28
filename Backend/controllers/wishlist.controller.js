const UserModel = require("../models/User.models");
const ProductModel = require("../models/productSchema");
const api = require("../utils/api");

module.exports.AddToWishlist = async (req, res) => {
  try {

    if (req.user.role !== "buyer") {
      return api.error(res, null, "Only buyers can use wishlist", 403);
    }

    const userid = req.user.id;
    const { productid } = req.body;
    const user = await UserModel.findById(userid);
    if (!user) return api.error(res, null, "User not found", 404);

    if (user.wishlist.includes(productid)) {
      return api.error(res, null, "Product already in wishlist", 400);
    }
    

    user.wishlist.push(productid);
    await user.save();

    api.success(res, null, "Product added to wishlist");
  } catch (error) {
    api.error(res, error);
  }
};

module.exports.GetWishlist = async (req, res) => {
  try {

    if (req.user.role !== "buyer") {
      return api.error(res, null, "Only buyers can use wishlist", 403);
    }
    const userid = req.user.id;
    const user = await UserModel.findById(userid).populate("wishlist");
    if (!user) return api.error(res, null, "User not found", 404);

    api.success(res, user.wishlist);
  } catch (error) {
    api.error(res, error);
  }
};

module.exports.RemoveFromWishlist = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return api.error(res, null, "Only buyers can use wishlist", 403);
    }
    const userid = req.user.id;
    const productid = req.params.id;

    const user = await UserModel.findById(userid);
    if (!user) return api.error(res, null, "User not found", 404);

    user.wishlist = user.wishlist.filter(pid => pid.toString() !== productid);
    await user.save();

    api.success(res, null, "Product removed from wishlist", 200);
  } catch (error) {
    api.error(res, error);
  }
};