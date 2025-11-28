const router = require("express").Router();
const CartController = require("../controllers/cart.controller");




router.get("/", CartController.GetCart);
router.post("/add", CartController.AddtoCart);
router.delete("/removed/:id", CartController.RemoveCart);


module.exports = router