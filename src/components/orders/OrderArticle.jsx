import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";

const OrderArticle = ({ order, user }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalQuantity = (order.items || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  return (
    <div>
      <div className="w-full my-2">
        <article className="w-full">
          <div
            id="wrapper"
            className="max-w-md mx-auto flex flex-row justify-between items-center p-4 border border-black rounded-md"
          >
            {/* Left Side: Order ID */}
            <div className="font-bold text-2xl">#{order.id}</div>

            {/* Right Side: Grid with fixed widths so columns align across cards */}
            <div className="grid grid-cols-[80px_100px_70px] items-center text-right">
              <span className="text-left">
                {new Date(order.date).toLocaleDateString()}
              </span>
              <span className="text-right">${formatPrice(order.total)}</span>
              <span className="text-right">
                {order.items?.length || 0} items
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default OrderArticle;
