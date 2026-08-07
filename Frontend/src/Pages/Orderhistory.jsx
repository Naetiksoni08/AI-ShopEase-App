import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

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

  const handleRemove = async (orderId) => {
    try {
      await axios.delete(`${api}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success("Removed from order history");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 pb-16 pt-24">
      <div className="max-w-3xl mx-auto">
        {role === "buyer" && orders.length > 0 && (
          <h1 className="text-3xl font-bold mb-8 text-white">Order History</h1>
        )}

        {!orders || orders.length === 0 ? (
          <p className="text-lg text-gray-400 text-center mt-20">
            You haven’t ordered anything yet.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <img
                    src={order.productId?.Image}
                    alt={order.productId?.name}
                    className="w-full h-40 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-700 mx-auto sm:mx-0"
                  />

                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h2 className="text-lg text-white font-semibold">
                        {order.productId?.name}
                      </h2>
                      <p className="text-indigo-400 font-bold mt-1">
                        ₹{order.productId?.price?.toLocaleString("en-IN") || "N/A"}
                      </p>
                    </div>

                    <div className="text-sm text-gray-400 mt-3 space-y-1">
                      <p>
                        <span className="text-gray-500">Ordered on:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p>
                        <span className="text-gray-500">Order ID:</span>{" "}
                        {order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => handleRemove(order._id)}
                        className="text-sm bg-red-900/60 hover:bg-red-900 text-red-200 px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;