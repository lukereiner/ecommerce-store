import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";

const OrderArticle = ({ order }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
      } catch (error) {
        console.error("Error fetching order items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, []);

  return (
    <div>
      <article>
        <h2>Order #{order.id}</h2>
        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
        <p>Total: ${formatPrice(order.total)}</p>
        <p>Status: {order.status}</p>
      </article>
    </div>
  );
};

export default OrderArticle;
