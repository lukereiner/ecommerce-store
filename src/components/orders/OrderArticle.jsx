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
          className="w-full flex flex-row items-center justify-between
      p-3 sm:p-5 border border-gray-100 bg-white rounded-lg shadow-sm
      group-hover:shadow-md transition-shadow gap-2"
        >
          {/* Order ID & Date */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">
              #{order.id}
            </span>

            <span className="text-xs sm:text-sm text-gray-500 border-l border-gray-200 pl-2 sm:pl-3 whitespace-nowrap">
              {new Date(order.date).toLocaleDateString()}
            </span>
          </div>

          {/* Items & Order Total */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-right">
            <span className="hidden min-[450px]:block text-gray-500 font-medium text-sm">
              {order.items?.length || 0}{" "}
              {order.items?.length === 1 ? "item" : "items"}
            </span>

            <span className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
              ${formatPrice(order.total)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default OrderArticle;