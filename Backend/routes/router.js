const router = require("express").Router();
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes")
const reviewRoutes = require("./review.Routes");
const cartRoutes = require("./cart.routes");
const SummarizerAgent = require("./ai.routes");
const wishlistRoutes = require("./wishlist.routes");
const OrderRoutes = require("../paymentapi/orderhistory");

const { auth } = require("../middlewares/auth");



router.use("/auth",authRoutes);
router.use("/product",productRoutes);

router.use("/review",auth,reviewRoutes);
router.use("/cart",auth,cartRoutes);
router.use("/wishlist",auth,wishlistRoutes);
router.use("/ai",auth, SummarizerAgent); 
router.use("/orders", auth, OrderRoutes); 




module.exports = router;






// “Auth middleware is only needed at those places where I want that the user should only access some feature once they’re logged in.
// Applying auth middleware on login/register is absurd because they haven’t even logged in yet.”