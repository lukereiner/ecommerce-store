import { useParams, Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import Navbar from "../Navbar";
import Footer from "../Footer";
import RefundButton from "../refunds/RefundButton";

const Order = () => {
  const { orderId } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  // Fallback UI if someone navigates directly to /orders/:orderId via direct URL paste
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">
              Order data is not available. Please navigate from your order
              history.
            </p>
            <Link
              to="/members"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              Back to orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Back Link */}
        <Link
          to="/members"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Back to orders
        </Link>

        {/* Header & Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Order ID: <strong className="text-gray-900">#{orderId}</strong>
              </p>
            </div>

            {/* Status Badge */}
            <span className="self-start sm:self-center px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {order.status || "Completed"}
            </span>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
            {/* Left Third: Left-Aligned */}
            <div className="text-left">
              <span className="block text-gray-500 text-xs">Date Placed</span>
              <span className="font-semibold text-gray-900">
                {new Date(order.date).toLocaleDateString()}
              </span>
            </div>

            {/* Middle Third: Centered */}
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Total Items</span>
              <span className="font-semibold text-gray-900">
                {order.items?.length || 0}
              </span>
            </div>

            {/* Right Third: Right-Aligned */}
            <div className="text-right">
              <span className="block text-gray-500 text-xs">Total Amount</span>
              <span className="font-bold text-gray-900 text-base">
                ${formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Items Included
          </h2>

          <ul className="divide-y divide-gray-100">
            {order.items?.map((item) => (
              <li
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <Link
                    to={`/products/${item.productId}`}
                    state={{
                      product: {
                        id: item.productId,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        image_url: item.image_url,
                      },
                    }}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                  >
                    {item.name}
                  </Link>
                  <span className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </span>
                </div>

                <span className="font-semibold text-gray-900">
                  ${formatPrice(item.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Button */}
        <div className="flex justify-center">
          <RefundButton order={order}/>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Order;
