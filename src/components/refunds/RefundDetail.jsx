import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import Navbar from "../Navbar";
import Footer from "../Footer";

const RefundDetail = () => {
  const { refundId } = useParams();
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefundData = async () => {
      try {
        const response = await axios.get(`/api/refunds/${refundId}`);
        setRefund(response.data);
      } catch (error) {
        console.error("Error fetching refund details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRefundData();
  }, [refundId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Loading refund details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Refund Details</h2>
            <p className="text-gray-600">Refund record not found.</p>
            <Link
              to="/members"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate =
    refund.created_at && !isNaN(new Date(refund.created_at))
      ? new Date(refund.created_at).toLocaleDateString()
      : "N/A";

  const totalItemsCount =
    refund.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          to={`/orders/${refund.order_id}`}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Back to Order #{refund.order_id}
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Refund #{refund.id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Associated Order:{" "}
                <strong className="text-gray-900">#{refund.order_id}</strong>
              </p>
            </div>
            <span
              className={`self-start sm:self-center px-3 py-1 text-xs font-semibold rounded-full border ${
                refund.status === "COMPLETE"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {refund.status}
            </span>
          </div>

          <div className="grid grid-cols-3 items-start gap-2 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 text-sm">
            {/* Date Processed */}
            <div className="min-w-0 text-left">
              <span className="block text-gray-500 text-xs leading-4 min-h-4">
                Date Processed
              </span>
              <span className="block font-semibold text-gray-900 whitespace-nowrap">
                {formattedDate}
              </span>
            </div>

            {/* Items Returned */}
            <div className="min-w-0 text-center">
              <span className="block text-gray-500 text-xs leading-4 min-h-4">
                Items Returned
              </span>
              <span className="block font-semibold text-gray-900 whitespace-nowrap">
                {totalItemsCount}
              </span>
            </div>

            {/* Total Amount */}
            <div className="min-w-0 text-right">
              <span className="block text-gray-500 text-xs leading-4 min-h-4">
                Total Amount
              </span>
              <span className="block font-bold text-green-700 text-sm sm:text-base whitespace-nowrap">
                -${formatPrice(refund.amount)}
              </span>
            </div>
          </div>

          {refund.reason && (
            <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
              <span className="text-gray-500 text-xs block">Reason</span>
              <span className="font-medium text-gray-800">{refund.reason}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Refunded Items
          </h2>
          {refund.items && refund.items.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {refund.items.map((item) => (
                <li
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <Link
                        to={`/products/${item.productid}`}
                        state={{ product: item, item }}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                      >
                        {item.name || `Item #${item.order_item_id}`}
                      </Link>
                      <span className="text-sm text-gray-500 block">
                        Qty Refunded: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${formatPrice(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No item details found for this refund.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundDetail;
