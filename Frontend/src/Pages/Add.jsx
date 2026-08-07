import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/Product/productslice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CATEGORIES = ["Gaming", "Electronics", "Fashion", "Home", "Accessories"];

const Add = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    Image: '',
    description: '',
    category: '',
    brand: '',
    stock: 0
  });

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

    try {
      const result = await dispatch(addProduct({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock) || 0
      }));

      if (addProduct.fulfilled.match(result)) {
        navigate("/product");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <form className="flex justify-center items-start bg-gray-20 px-4 pt-28 pb-24" onSubmit={handleSubmit}>
      <fieldset className="mx-auto fieldset bg-gray-800 border-base-300 rounded-box 
            w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 shadow-xl p-6">

        <h2 className="text-2xl font-semibold mb-6 text-center">Add Product</h2>

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
        <input type="text" className="input w-full" name="brand" placeholder="Generic" value={product.brand} onChange={handleChange} />

        <label className="label p-2 text-sm">Stock (max 20)</label>
        <input type="number" className="input w-full" name="stock" min="0" max="20" value={product.stock} onChange={handleChange} />

        <label className="label p-2 text-sm">Product Description</label>
        <textarea className="textarea w-full" name="description" value={product.description} onChange={handleChange} />

        <button type="submit" className="btn btn-neutral mt-4 w-full">Add Product</button>

      </fieldset>

    </form>
  );
};

export default Add;