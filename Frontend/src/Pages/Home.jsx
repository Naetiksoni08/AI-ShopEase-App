import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import heroBanner from "../assets/hero-banner.avif";
import { IoGameController, IoGlasses } from "react-icons/io5";
import { FaLaptop, FaTshirt, FaCouch, FaGem, FaTv } from "react-icons/fa";
import { IoIosTv } from "react-icons/io";


const CATEGORIES = [
  { name: "Gaming", icon: IoGameController },
  { name: "Electronics", icon: FaTv },
  { name: "Fashion", icon: FaTshirt },
  { name: "Home", icon: FaCouch },
  { name: "Accessories", icon: IoGlasses },
];

const Home = () => {
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  const [featured, setFeatured] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${api}/api/product`, { params: { sort: "rating", limit: 4 } })
      .then((res) => setFeatured(res.data.data.products))
      .catch((err) => console.log("Featured products fetch error", err));
  }, []);

  const handleViewProducts = () => {
    if (!isLoggedIn) {
      toast.warning("You need to log in first to view products!");
      navigate("/login");
      return;
    }
    navigate("/product");
  };

  const handleSecondaryCta = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(role === "seller" ? "/product/add" : "/product");
  };

  return (
    <div>
      {/* HERO */}
      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Layered gradient instead of flat overlay — darker at edges/bottom,
            lighter in the center so the image actually reads through */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-black/30"></div>

        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-5xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
            Discover, Shop & Inspire
          </h1>
          <p className="text-lg text-gray-200 mb-6 leading-relaxed drop-shadow">
            Welcome to <span className="font-bold">ShopEase</span> — your destination for unique products and endless creativity.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleViewProducts}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all"
            >
              View Products
            </button>

            <button
              onClick={handleSecondaryCta}
              className="border border-white hover:bg-white hover:text-black font-medium px-6 py-3 rounded-full transition-all"
            >
              {isLoggedIn
                ? role === "seller" ? "Add Product" : "Browse Products"
                : "Login"}{" "}
              <span className="text-lg font-bold">&gt;&gt;</span>
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              to={`/product?category=${name}`}
              className="group flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-2xl
                   bg-gray-800/80 border border-gray-700
                   hover:bg-gray-800 hover:border-amber-500/60 hover:-translate-y-1
                   shadow-sm hover:shadow-lg hover:shadow-amber-900/20
                   transition-all duration-200"
            >
              <Icon className="text-3xl text-emerald-500 group-hover:text-emerald-400 transition-colors" />
              <span className="text-sm font-medium text-gray-200">{name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-6">Top Rated Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((product) => (
              <div
                key={product._id}
                className="card bg-base-100 w-full shadow-sm cursor-pointer"
                onClick={() => navigate(`/product/${product._id}/show`)}
              >
                <figure>
                  <img
                    src={product.Image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                    className="h-40 w-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-indigo-400 font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;