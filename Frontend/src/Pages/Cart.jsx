import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/cart/cartSlice";
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

  const cartemptynavigate = () => {
    navigate("/product");
  };

  const handleBuyNow = async (item) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/payment/order",
        { amount: item.price },
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
              "http://localhost:5001/api/payment/verify",
              {
                userId: userId,
                productId: item._id,
                amount: item.price,
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
    <div className="mt-20 md:mt-0 flex justify-center flex-col items-center gap-6 h-auto min-h-screen">
      {!cartItems || cartItems.length === 0 ? (
        <p className="text-xl font-semibold text-gray-200">
          Your cart is empty..
          <br />
          <a
            onClick={cartemptynavigate}
            className="text-center cursor-pointer underline text-blue-600 hover:text-blue-800"
          >
            Shop today’s deals
          </a>
        </p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row w-11/12 sm:w-4/5 md:w-2/3 bg-dark shadow-xl rounded-lg"
          >
            {/* Product Image */}
            <div className="w-full sm:w-1/3">
              <img
                src={
                  item.Image ||
                  "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                }
                alt={item.name}
                className="w-full h-40 sm:h-48 md:h-full object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <p className="text-gray-600 mt-1">₹{item.price}</p>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                {role === "buyer" && (
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
                  >
                    Remove
                  </button>
                )}

                {role === "buyer" && (
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                  >
                    Buy Now
                  </button>
                )}

              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
