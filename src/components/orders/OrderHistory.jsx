import React, { useState, useEffect } from "react";
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <section>
        <div>
          <h1 className="font-bold text-2xl">Order History | {orders.length} orders</h1>
        </div>
      </section>

      <section>
        {orders.length === 0 ? (
          <p>No Orders found.</p>
        ) : (
          <div>
            {orders.map((order) => (
              <OrderArticle key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderHistory;
