import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/Product/productslice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import FilterBar from '../Components/FilterBar';

const ListProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items: products, pagination } = useSelector((state) => state.product);
  const role = useSelector((state) => state.auth.role);

  const [wishlist, setWishlist] = useState([]);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(fetchProducts(params));
  }, [dispatch, searchParams]);

  // 💖 Fetch wishlist
  const fetchWishlist = async () => {
    try {
      if (role !== "buyer") return;
      const res = await axios.get(`${api}/api/wishlist`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(res.data.data.map((item) => item._id));
    } catch (error) {
      console.log("Wishlist fetch error", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`${api}/api/wishlist/remove/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.info("Removed from wishlist");
      } else {
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

  const goToPage = (page) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-20">
      <FilterBar />

      {products.length === 0 ? (
        <p className="text-center text-gray-400 mt-10 text-lg">
          No products match your filters.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4 m-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}/show`)}
              className="card bg-base-100 w-96 shadow-sm mx-auto cursor-pointer border-2 border-transparent transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product._id);
                }}
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
                  <button
                    className="btn btn-primary w-full sm:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}/show`);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-10">
          <button
            className="btn btn-sm"
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            Prev
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="btn btn-sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => goToPage(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListProduct;