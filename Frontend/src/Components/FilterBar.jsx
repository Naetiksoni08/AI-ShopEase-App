import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBoxOpen, FaStore } from "react-icons/fa";

const CATEGORIES = ["Gaming", "Electronics", "Fashion", "Home", "Accessories"];

const FilterBar = ({ isMine }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef(null);
  const role = useSelector((state) => state.auth.role);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const pushToUrl = (updated) => {
    const params = {};
    if (updated.search) params.search = updated.search;
    if (updated.category) params.category = updated.category;
    if (updated.minPrice) params.minPrice = updated.minPrice;
    if (updated.maxPrice) params.maxPrice = updated.maxPrice;
    if (updated.sort && updated.sort !== "newest") params.sort = updated.sort;
    setSearchParams(params, { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushToUrl(updated), 400);
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const cleared = { search: "", category: "", minPrice: "", maxPrice: "", sort: "newest" };
    setFilters(cleared);
    setSearchParams({}, { replace: true });
  };

  const setMine = (mine) => {
    if (mine === isMine) return;
    setSearchParams(mine ? { mine: "true" } : {}, { replace: true });
  };

  return (
    <div className="sticky top-16 z-40 bg-gray-800 border-b border-gray-700 px-4 py-3 flex flex-wrap gap-4 items-center">

      {role === "seller" && (
        <div className="inline-flex bg-gray-950/60 border border-gray-700 rounded-full p-1 shrink-0">
          <button
            onClick={() => setMine(false)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
              ${!isMine
                ? "bg-indigo-500 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
              }`}
          >
            <FaStore className="text-xs" />
            All Products
          </button>
          <button
            onClick={() => setMine(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
              ${isMine
                ? "bg-indigo-500 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
              }`}
          >
            <FaBoxOpen className="text-xs" />
            My Products
          </button>
        </div>
      )}

      {!isMine && (
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleChange}
            className="input input-sm input-bordered w-48"
          />

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="select select-sm select-bordered w-40"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Min ₹"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
            className="input input-sm input-bordered w-24"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max ₹"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
            className="input input-sm input-bordered w-24"
          />

          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="select select-sm select-bordered w-44"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <button onClick={handleReset} className="btn btn-sm btn-ghost">
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;