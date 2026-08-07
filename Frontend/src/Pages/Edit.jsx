import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, updateProduct } from "../redux/Product/productslice"
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CATEGORIES = ["Gaming", "Electronics", "Fashion", "Home", "Accessories"];

const Edit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct } = useSelector((state) => state.product);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    Image: "",
    description: "",
    category: "",
    brand: "",
    stock: 0
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        name: selectedProduct.name || "",
        price: selectedProduct.price || "",
        Image: selectedProduct.Image || "",
        description: selectedProduct.description || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        stock: selectedProduct.stock ?? 0
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(product.stock) > 20) {
      toast.error("Stock cannot be more than 20");
      return;
    }

    const { _id, reviews, createdAt, updatedAt, __v, ...cleaned } = product;

    const result = await dispatch(
      updateProduct({
        id,
        updatedData: {
          ...cleaned,
          price: Number(cleaned.price),
          stock: Number(cleaned.stock) || 0
        }
      })
    );

    if (updateProduct.fulfilled.match(result)) {
      navigate("/product");
    }
  };



  return (
    <form className="flex justify-center items-start px-4 pt-28 pb-24" onSubmit={handleSubmit}>
      <fieldset className="mx-auto fieldset bg-gray-800 border-base-300 rounded-box 
            w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 shadow-xl p-6">

        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Product</h2>

        <label className="label p-2 text-sm">Product Name</label>
        <input type="text" className="input w-full" name="name" value={product.name} onChange={handleChange} required />

        <label className="label p-2 text-sm">Product Price</label>
        <input type="number" className="input w-full" name="price" value={product.price} onChange={handleChange} required />

        <label className="label p-2 text-sm">Product Image</label>
        <input type="text" className="input w-full" name="Image" value={product.Image} onChange={handleChange} required />

        <label className="label p-2 text-sm">Category</label>
        <select className="select w-full" name="category" value={product.category} onChange={handleChange} required>
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="label p-2 text-sm">Brand</label>
        <input type="text" className="input w-full" name="brand" value={product.brand} onChange={handleChange} />

        <label className="label p-2 text-sm">Stock (max 20)</label>
        <input type="number" className="input w-full" name="stock" min="0" max="20" value={product.stock} onChange={handleChange} />

        <label className="label p-2 text-sm">Product Description</label>
        <textarea className="textarea w-full" name="description" value={product.description} onChange={handleChange} />

        <button type="submit" className="btn btn-neutral mt-4 w-full">Edit Product</button>

      </fieldset>
    </form>
  )
}

export default Edit;