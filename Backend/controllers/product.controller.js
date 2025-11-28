const ProductModel = require("../models/productSchema");
const api = require("../utils/api");




module.exports.CreateProduct = async (req, res) => {
    try {
        const { name, price, Image, description } = req.body;
        const product = await ProductModel.create({ name, price, Image, description});
        api.success(res, product);
    } catch (error) {
        api.error(res, error, "Failed to create product");
    }
}


module.exports.getProductById = async (req, res) => {
    try {
        const productid = req.params.id;
        const Product = await ProductModel.findById(productid);
        api.success(res, Product, "Product fetched successfully!");
    } catch (error) {
        api.error(res, error, "Failed to fetch product");
    }

}

module.exports.GetAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({}) // get all  
        api.success(res, products, "Products fetched successfully!");
    } catch (error) {
        api.error(res, error, "Failed to fetch products");
    }
}



module.exports.UpdateProduct = async (req, res) => {
    try {
        const productid = req.params.id;
        const { name, price, Image, description } = req.body;

        if (!productid) throw new Error("product id  Required !!");
        const data = {};

        if (name) data.name = name;
        if (price) data.price = price;
        if (Image) data.Image = Image;
        if (description) data.description = description;

        if (Object.keys(data).length == 0) {
            throw new Error("name,price,Image or description is Required !!"); // object is a class and usske andar .keys aur .values hai aur uske andar data pass karna hota hai fir uski length nikal lo agar equal to 0 hai that means ki bhai data is empty this is validation wala part backend level ka use joi or zod
        }

        const updatedproduct = await ProductModel.findByIdAndUpdate(productid, data, { new: true });
        api.success(res, updatedproduct, "Product updated successfully!");
    } catch (error) {
        api.error(res, error, "Failed to update product");
    }
}




module.exports.DeleteProduct = async (req, res) => {
    try {
        const productid = req.params.id;
        const deletedProduct = await ProductModel.findByIdAndDelete(productid);
        api.success(res, deletedProduct, "Product deleted successfully!");
    } catch (error) {
        api.error(res, error, "Failed to delete product");
    }
}




// create Product -- createproduct
// get specific product -- getproductbyid
// bulk get products -- getallproducts
// update products -- updateproduct
// delete products -- deleteproduct

