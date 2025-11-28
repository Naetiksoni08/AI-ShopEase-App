import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const user = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleViewProducts = () => {
    if (!token) {
      toast.warning("You need to log in first to view products!");
      return;
    }
    navigate("/product");
  };

  const handleAddProduct = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/product");
  };

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1607082349566-187342175e2c?auto=format&fit=crop&w=1470&q=80')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
          Discover, Shop & Inspire
        </h1>
        <p className="text-lg text-gray-200 mb-6 leading-relaxed">
          Welcome to <span className="font-semibold text-indigo-400">ShopEase</span> — your destination for unique products and endless creativity.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleViewProducts}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all"
          >
            View Products
          </button>

          <button
            onClick={handleAddProduct}
            className="border border-white hover:bg-white hover:text-black font-medium px-6 py-3 rounded-full transition-all"
          >
             Login <span className="text-lg font-bold">&gt;&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home