import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    fetchOrders();
  }, []);

  const api = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${api}/api/orders/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.data || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-300">
      {role == "buyer" && orders.length>0 &&(
        <h1 className="text-3xl font-bold mb-8 mt-30  text-gray-900">Shopping Cart</h1>

      )}

      {!orders || orders.length === 0 ? (
        <p className="text-lg text-gray-600 mt-90">You haven’t ordered anything yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="w-full sm:w-3/4 md:w-2/3 bg-gray-200 p-4 mb-6 rounded-lg shadow-md border"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={order.productId?.Image}
                alt={order.productId?.name}
                className="w-32 h-32 object-cover rounded-md border mx-auto sm:mx-0"
              />

              <div className="flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-xl text-gray-950 font-semibold">{order.productId?.name}</h2>
                  <p className="card-title text-gray-600">₹{order.productId.price.toLocaleString("en-IN")}</p>
                </div>

                <div className="text-sm text-gray-500 mt-3">
                  <p>
                    <strong>Ordered On:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {order.razorpay_order_id}
                  </p>
                  <p>
                    <strong>Payment ID:</strong> {order.razorpay_payment_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
