const ProductModel = require("../models/productSchema");
const api = require("../utils/api");
const UserModel = require("../models/User.models")

module.exports.AddtoCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productid, quantity = 1 } = req.body;

    const product = await ProductModel.findById(productid);
    if (!product) return api.error(res, null, "Product not found", 404);
    if (product.stock === 0) {
      return api.error(res, null, "Product is out of stock", 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) return api.error(res, null, "User not Found", 404);

    user.cart = user.cart.filter((item) => item && item.product);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productid
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productid, quantity: Number(quantity) });
    }

    await user.save();

    api.success(res, null, "Product Added to Cart");

  } catch (error) {
    api.error(res, error);
  }
};

module.exports.GetCart = async (req, res) => {
  try {
    const userid = req.user.id;

    const user = await UserModel.findById(userid).populate("cart.product");
    if (!user) return api.error(res, null, "User not found", 404);

    const cartItems = user.cart
      .filter((item) => item && item.product)
      .map((item) => ({
        ...item.product.toObject(),
        quantity: item.quantity,
      }));

    api.success(res, cartItems);

  } catch (error) {
    api.error(res, error);
  }
};

module.exports.RemoveCart = async (req, res) => {
  try {
    const userid = req.user.id;
    const productid = req.params.id;

    const user = await UserModel.findById(userid);
    if (!user) return api.error(res, null, "User not found", 404);

    user.cart = user.cart.filter(
      (item) => item && item.product && item.product.toString() !== productid
    );

    await user.save();

    api.success(res, null, "Product Removed Successfully", 200);

  } catch (error) {
    api.error(res, error);
  }
};

module.exports.UpdateCartQuantity = async (req, res) => {
  try {
    const userid = req.user.id;
    const productid = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return api.error(res, null, "Quantity must be at least 1", 400);
    }

    const user = await UserModel.findById(userid);
    if (!user) return api.error(res, null, "User not found", 404);

    const item = user.cart.find(
      (item) => item && item.product && item.product.toString() === productid
    );
    if (!item) return api.error(res, null, "Product not in cart", 404);

    item.quantity = Number(quantity);
    await user.save();

    api.success(res, { productid, quantity: item.quantity }, "Quantity updated");

  } catch (error) {
    api.error(res, error);
  }
};