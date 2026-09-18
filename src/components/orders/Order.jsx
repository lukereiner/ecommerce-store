import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const Order = () => {
  const { orderId } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  // Fallback UI if someone navigates directly to /orders/:orderId via direct URL paste
  if (!order) {
    return (
      <div className="p-4">
        <h2>Order Details</h2>
        <p>
          Order data is not available. Please navigate from your order history.
        </p>
        <Link to="/members" className="text-blue-600 underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
<div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Order Details</h2>
      <p className="text-gray-600 mb-4">
        Viewing data for <strong>Order ID: #{orderId}</strong>
      </p>

      <div className="border p-4 rounded-lg bg-gray-50 mb-4">
        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">Items Included:</h3>
      <ul className="divide-y border rounded-lg bg-white mb-6">
        {order.items?.map((item) => (
          <li key={item.id} className="p-3 flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${formatPrice(item.price)}</p>
          </li>
        ))}
      </ul>

      <Link to="/members" className="text-blue-600 underline">
        ← Back to orders
      </Link>
    </div>
  );
};

export default Order;
