const router = require("express").Router();
const { auth: authMiddleware } = require("../middlewares/auth");
const ProductController = require("../controllers/product.controller");
const validate = require("../middlewares/validate");
const { productschemaValidator } = require("../validations/product/product");
const { productUpdateValidator } = require("../validations/product/updateproduct");

router.get("/", ProductController.GetAllProducts); //bulk get products
router.get("/:id", ProductController.getProductById); // show specific product
router.post("/", authMiddleware, validate(productschemaValidator), ProductController.CreateProduct); // create a product
router.put("/:id", authMiddleware, validate(productUpdateValidator), ProductController.UpdateProduct); // update a product
router.delete("/:id", authMiddleware, ProductController.DeleteProduct); // delete a products 


module.exports = router;

