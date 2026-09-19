import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import OrderArticle from "./OrderArticle";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/orders/user/${user.id}`);

        const adjustedOrders = response.data.map((order) => ({
          id: order.id,
          date: order.created,
          total: order.total,
          status: order.status,
          items: (order.items || []).map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            productId: item.productid,
            name: item.name,
            description: item.description,
            image_url: item.image_url,
          })),
        }));

        setOrders(adjustedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (loading)
    return <p className="text-center py-8 text-gray-500 font-medium">Loading orders...</p>;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
          Order History{" "}
          <span className="text-base font-normal text-gray-500">
            ({orders.length} {orders.length === 1 ? "order" : "orders"})
          </span>
        </h2>
      </div>

      <div>
        {orders.length === 0 ? (
          <p className="text-center py-8 text-gray-500 italic">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderArticle key={order.id} order={order} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;