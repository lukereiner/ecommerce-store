import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import Navbar from "../Navbar";
import Footer from "../Footer";
import RefundButton from "../refunds/RefundButton";

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">Order data is not available.</p>
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

  const formattedDate = order.created && !isNaN(new Date(order.created))
    ? new Date(order.created).toLocaleDateString()
    : "N/A";

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          to="/members"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Back to orders
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-500 mt-1">
                Order ID: <strong className="text-gray-900">#{orderId}</strong>
              </p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {order.status || "COMPLETE"}
            </span>
          </div>

          {/* Original Order Summary Section */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
            <div className="text-left">
              <span className="block text-gray-500 text-xs">Date Placed</span>
              <span className="font-semibold text-gray-900">{formattedDate}</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Total Items</span>
              <span className="font-semibold text-gray-900">{order.items?.length || 0}</span>
            </div>
            <div className="text-right">
              <span className="block text-gray-500 text-xs">Total Amount</span>
              <span className="font-bold text-gray-900">
                ${formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Refund History Module */}
          {order.refunds && order.refunds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Refund History</h3>
              <div className="space-y-2">
                {order.refunds.filter((refund) => refund.status === "COMPLETE").map((refund) => (
                  <Link
                    key={refund.id}
                    to={`/refunds/${refund.id}`}
                    className="flex justify-between items-center bg-blue-50/50 p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-700">#{refund.id}</span>
                      <span className="text-xs text-blue-600/70">
                        {new Date(refund.created).toLocaleDateString()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        refund.status === "COMPLETE" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {refund.status}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-700">
                      -${formatPrice(refund.amount)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clean Original Items Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Items Included</h2>
          <ul className="divide-y divide-gray-100">
            {order.items?.map((item) => (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Link
                    to={`/products/${item.productid}`}
                    state={{ product: item, item}}
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

        <div className="flex justify-center">
          <RefundButton order={order} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Order;