import { Link } from "react-router-dom";

const RefundButton = ({ order }) => {
  return (
    <>
      <div>
        <Link
          to={`/refunds/${order.id}`}
          state={{ order }}>
          <button className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm focus:outline-none cursor-pointer">
            <p className="font-bold">Refund Order</p>
          </button>
        </Link>
      </div>
    </>
  );
};

export default RefundButton;
