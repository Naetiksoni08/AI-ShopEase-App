import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/Product/productslice";
import { useNavigate } from 'react-router-dom';



const Add = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [product, setProduct] = useState({
    name: '',
    price: '',
    Image: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(addProduct(product));

      if (addProduct.fulfilled.match(result)) {
        navigate("/product");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <form className="flex justify-center items-start min-h-screen bg-gray-20" onSubmit={handleSubmit}>
      <fieldset className="mt-30 mx-auto fieldset bg-gray-800 border-base-300 rounded-box 
                  w-11/13 sm:w-2/3 md:w-1/2 lg:w-1/3 shadow-xl p-6">
                    
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Product</h2>

        <label className="label p-2 text-sm">Product Name</label>
        <input type="text" className="input w-full" name="name" value={product.name} onChange={handleChange} required />

        <label className="label p-2 text-sm">Product Price</label>
        <input type="number" className="input w-full" name="price" value={product.price} onChange={handleChange} required />

        <label className="label p-2 text-sm">Product Image</label>
        <input type="text" className="input w-full" name="Image" value={product.Image} onChange={handleChange} required />

        <label className="label p-2 text-sm">Product Description</label>

        <textarea className="textarea w-full" name="description" value={product.description} onChange={handleChange} />

        <button type="submit" className="btn btn-neutral mt-4 w-full">Add Product</button>


      </fieldset>
      
    </form>
  );
};

export default Add;