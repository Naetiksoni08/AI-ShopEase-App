import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateQuantity } from "../redux/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const Dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useSelector((state) => state.cart);
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    Dispatch(fetchCart());
  }, [Dispatch]);

  const handleRemove = (productId) => {
    Dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    Dispatch(updateQuantity({ productId: item._id, quantity: newQuantity }));
  };

  const cartemptynavigate = () => {
    navigate("/product");
  };

  const api = import.meta.env.VITE_API_URL;

  const handleBuyNow = async (item) => {
    try {
      const totalAmount = item.price * item.quantity;

      const { data } = await axios.post(
        `${api}/api/payment/order`,
        { amount: totalAmount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const order = data.data;

      const options = {
        key: "rzp_test_RUTxFqCzlLGV4C",
        amount: order.amount,
        currency: order.currency,
        name: "ShopEase",
        description: item.name,
        order_id: order.id,

        handler: async function (response) {
          toast.success("Payment Successful!");


          try {
            await axios.post(
              `${api}/api/payment/verify`,
              {
                userId: userId,
                productId: item._id,
                amount: totalAmount,
                quantity: item.quantity,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            Dispatch(fetchCart());
          } catch (error) {
            console.log(error);
            toast.error("Payment Verification Failed");
          }
        },

        prefill: {
          name: "Naetik Soni",
          email: "naetik@example.com",
          contact: "9999999999",
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment Failed. Please try again");
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 flex flex-col items-center gap-6">
      {!cartItems || cartItems.length === 0 ? (
        <p className="text-xl font-semibold text-gray-200 mt-20 text-center">
          Your cart is empty..
          <br />
          <a
            onClick={cartemptynavigate}
            className="text-center cursor-pointer underline text-blue-500 hover:text-blue-400 transition-colors"
          >
            Shop today's deals
          </a>
        </p>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-white mb-2">Your Cart</h1>

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row w-full bg-gray-900 border border-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-gray-700"
            >
              {/* Product Image */}
              <div className="w-full sm:w-1/3">
                <img
                  src={
                    item.Image ||
                    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  }
                  alt={item.name}
                  className="w-full h-48 sm:h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="w-full sm:w-2/3 p-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{item.name}</h2>
                  <p className="text-indigo-400 font-semibold mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                    {item.quantity > 1 && (
                      <span className="text-gray-400 font-normal text-sm ml-2">
                        × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-400 mt-2 text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>

                {/* Action Buttons + Quantity Stepper */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {role === "buyer" && (
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="bg-red-900/80 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors cursor-pointer font-medium"
                      >
                        Remove
                      </button>
                    )}

                    {role === "buyer" && (
                      <button
                        onClick={() => handleBuyNow(item)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer font-medium shadow-md shadow-indigo-900/30"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>

                  {/* Quantity stepper — bottom-right of the card */}
                  {role === "buyer" && (
                    <div className="flex items-center gap-3 sm:ml-auto">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;