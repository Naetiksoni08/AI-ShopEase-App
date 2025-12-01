import React, { useEffect, useState, useContext } from 'react'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Addproduct from './Pages/Add'
import Editproduct from './Pages/Edit'
import ListProduct from './Pages/ListProduct'
import ShowProducts from './Pages/Show'
import Footer from './Components/Footer'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from './Pages/Cart'
import axios from 'axios'
import ProtectedRoute from './Components/ProtectedRoute'
import { useSelector } from 'react-redux'
import OrderHistory from './Pages/Orderhistory'
// import { AuthContext } from './Context/AuthContext'

const App = () => {

  
  // const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  const { token, username } = useSelector((state) => state.auth);
  const user = token ? { username } : null;

  const api = import.meta.env.VITE_API_URL;

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${api}/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCartItems(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch cart");
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user?.username]);


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cartItems} setCartItems={setCartItems} />
      <div className="flex-1">
      <Routes>
        {/* public routes */}
        <Route path='/' element={ <Home /> } />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
       

        {/* Protected Routes */}
    
        <Route path='/product' element={<ProtectedRoute> <ListProduct /> </ProtectedRoute>} />
        <Route path='/product/add' element={<ProtectedRoute> <Addproduct /> </ProtectedRoute>} />
        <Route path="/product/cart" element={<ProtectedRoute> <Cart cartItems={cartItems} setCartItems={setCartItems} fetchCart={fetchCart} /> </ProtectedRoute>} />
        <Route path='/product/:id/show' element={<ProtectedRoute> <ShowProducts fetchCart={fetchCart} /></ProtectedRoute>} />
        <Route path='/product/edit/:id' element={<ProtectedRoute> <Editproduct /> </ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute> <OrderHistory /> </ProtectedRoute>} />
      </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Footer />
    </div>
  )

}

export default App