import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { fetchProducts } from '../redux/Product/productslice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ListProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products } = useSelector((state) => state.product);
  const role = useSelector((state) => state.auth.role);

  const [wishlist, setWishlist] = useState([]);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 💖 Fetch wishlist
  const fetchWishlist = async () => {
    try {
      if (role !== "buyer") return;
      const res = await axios.get(`${api}/api/wishlist`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(res.data.data.map((item) => item._id)); // store only product IDs
    } catch (error) {
      console.log("Wishlist fetch error", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);


  // 💖 Toggle Wishlist (Add / Remove)
  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        // remove from wishlist
        await axios.delete(`${api}/api/wishlist/remove/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.info("Removed from wishlist");
      } else {
        // add to wishlist
        await axios.post(
          `${api}/api/wishlist/add`,
          { productid: productId },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setWishlist((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist update failed");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 m-4 mt-20">
      {products.map((product) => (
        <div key={product._id} className="card bg-base-100 w-96 shadow-sm mx-auto">

          {/* ❤️ Wishlist icon */}
          <button
            onClick={() => toggleWishlist(product._id)}
            disabled={role !== "buyer"} 
            className={`absolute top-3 right-3 z-10 transition
              ${role !== "buyer" ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}
            `}
          >
            {wishlist.includes(product._id) ? (
             
              <FaHeart className="text-2xl text-red-500" />
            ) : (
              <FaRegHeart className="text-2xl text-gray-400 hover:text-red-400 " />
            )}
          </button>


          <figure>
            <img src={product.Image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"} />
          </figure>


          <div className="card-body">
            <h2 className="card-title">{product.name}</h2>
            <p className="card-title">₹{product.price.toLocaleString("en-IN")}</p>
            <p>{product.description}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={() => navigate(`/product/${product._id}/show`)}>Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default ListProduct;