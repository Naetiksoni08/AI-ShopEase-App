import React from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/Auth/authSlice";


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, username, role } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  const { items: cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.info("You have been logged out!");
    navigate("/login");
  };

  const getInitials = name =>
    name
      ? name.split(" ").map(n => n[0].toUpperCase()).slice(0, 2).join("")
      : "";

  const clickViewcartHandler = () => {
    navigate("/product/cart");
  }
  const viewproduct = () => {
    if (!isLoggedIn) {
      toast.warning("Please log in first to add a product !!")
    }
  }

  return (
    <>
      <div className="navbar bg-gray-800 shadow-sm  fixed top-0 left-0 right-0 z-50">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" to="/">ShopEase</Link>

          {isLoggedIn && (
            <>

              <Link className="btn btn-ghost text-xl" to="/product">Products</Link>

              {role === "seller" && (
                <Link className="btn btn-ghost text-xl" to="/product/add" onClick={viewproduct}>Add Product</Link>
              )}
            </>
          )}
        </div>

        {/* Cart */}
        {isLoggedIn && role === "buyer" && (
          <Link to="/orders" className="text-white px-4">Your Orders</Link>
        )}


        <div className="flex-none">
          {isLoggedIn && role === "buyer" && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                  {cartItems?.length > 0 && (
                    <span className="badge badge-xs indicator-item">{cartItems.length}</span>
                  )}

                </div>
              </div>


              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                <div className="card-body">
                  <span className="text-lg font-bold">{cartItems?.length || 0} Items</span>
                  <span className="text-info">
                    Subtotal: ₹{cartItems.reduce((t, i) => t + i.price, 0)}
                  </span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block" onClick={clickViewcartHandler}>View Cart</button>
                  </div>
                </div>
              </div>
            </div>
          )}






          {/* Avatar */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="rounded-full">
                {isLoggedIn ? (
                  <p className='text-xl font-medium flex items-center justify-center h-10 w-10 rounded-full text-white'>
                    {getInitials(username)}
                  </p>
                ) : (
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="avatar"
                    className="h-10 w-10 rounded-full"
                  />
                )}
              </div>
            </div>


            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              {isLoggedIn ? (
                <>
                  <li>
                    <p className='text-sm'>{username}</p></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className='text-red-500 hover:text-red-600'
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link className='text-red-600' to="/login">Log In</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>

  )
}

export default Navbar