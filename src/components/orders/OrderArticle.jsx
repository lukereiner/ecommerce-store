import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";

const OrderArticle = ({ order }) => {
  return (
    <article className="w-full">
      <Link
        to={`/orders/${order.id}`}
        state={{ order }}
        className="block group"
      >
        <div
          id="wrapper"
          className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-gray-100 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow gap-4"
        >
          {/* Left Side: Order ID & Date */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              #{order.id}
            </span>
            <span className="text-sm text-gray-500 border-l border-gray-200 pl-3">
              {new Date(order.date).toLocaleDateString()}
            </span>
          </div>

          {/* Right Side: Fixed-width Grid for aligned columns */}
          <div className="grid grid-cols-[80px_100px] items-center text-right w-full sm:w-auto text-sm">
            <span className="text-gray-500 font-medium text-right">
              {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
            </span>
            <span className="font-semibold text-gray-900 text-base text-right">
              ${formatPrice(order.total)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default OrderArticle;