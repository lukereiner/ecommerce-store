import Navbar from "../Navbar";
import Footer from "../Footer";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { useState } from "react";
import axios from "axios";

const RefundOrder = () => {
  const [refundQuantities, setRefundQuantities] = useState({});
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  const handleToggle = (item) => {
    setRefundQuantities((prev) => {
      const updated = { ...prev };
      if (updated[item.id] !== undefined) {
        delete updated[item.id];
      } else {
        updated[item.id] = item.quantity;
      }
      return updated;
    });
  };

  const handleQtyChange = (itemId, maxQty, delta) => {
    setRefundQuantities((prev) => {
      const currentQty = prev[itemId] || 1;
      const newQty = Math.max(1, Math.min(maxQty, currentQty + delta));
      return { ...prev, [itemId]: newQty };
    });
  };

 const handleRefund = async () => {
  const itemsToRefund = Object.keys(refundQuantities);
  if (itemsToRefund.length === 0) return;

  setIsSubmitting(true);
  try {
    const payload = {
      items: refundQuantities,
      reason: reason,
    }
    const response = await axios.post(`/api/refunds/${orderId}`, payload);
    
    const newRefundId = response.data?.id;

    if (newRefundId) {
      navigate(`/refunds/${newRefundId}`);
    } else {
      navigate(`/orders/${orderId}`);
    }
  } catch (err) {
    console.error("Error submitting refund:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">
              Refund data is not available. Please navigate from your order history.
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

  const selectedItemIds = Object.keys(refundQuantities).map(Number);
  const totalReturnItemsCount = selectedItemIds.length;

  const totalReturnQty = Object.values(refundQuantities).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const subtotalCents =
    order.items?.reduce((sum, item) => {
      const returnQty = refundQuantities[item.id] || 0;
      const itemPriceCents = Math.round(Number(item.price) * 100);
      return sum + itemPriceCents * returnQty;
    }, 0) || 0;

  const TAX_RATE = 0.07;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  const calculatedSubtotal = subtotalCents / 100;
  const calculatedTax = taxCents / 100;
  const calculatedTotal = totalCents / 100;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Back to order
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Refund Order</h1>
              <p className="text-sm text-gray-500 mt-1">
                Order ID: <strong className="text-gray-900">#{orderId}</strong>
              </p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
              REFUND
            </span>
          </div>

          <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
            <div className="text-left">
              <span className="block text-gray-500 text-xs">Return Items</span>
              <span className="font-semibold text-gray-900">{totalReturnItemsCount}</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Return Qty</span>
              <span className="font-semibold text-gray-900">{totalReturnQty}</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Subtotal</span>
              <span className="font-semibold text-gray-900">${formatPrice(calculatedSubtotal)}</span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Tax</span>
              <span className="font-semibold text-gray-900">${formatPrice(calculatedTax)}</span>
            </div>
            <div className="text-right">
              <span className="block text-gray-500 text-xs">Total Refund</span>
              <span className="font-bold text-gray-900">${formatPrice(calculatedTotal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Items to Return</h2>
          <ul className="divide-y divide-gray-100">
            {order.items?.map((item) => {
              const isChecked = refundQuantities[item.id] !== undefined;
              const returnQty = refundQuantities[item.id] || 0;
              const lineTotal = isChecked ? Number(item.price) * returnQty : Number(item.price);

              return (
                <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`item-${item.id}`}
                      checked={isChecked}
                      onChange={() => handleToggle(item)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-green-600"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/products/${item.productid}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-gray-500 block">
                        Purchased: {item.quantity} (${formatPrice(item.price)} ea)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    {isChecked && item.quantity > 1 ? (
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-xs">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
                          onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                          disabled={returnQty <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-xs sm:text-sm font-semibold text-gray-800 min-w-[20px] text-center">
                          {returnQty}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
                          onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                          disabled={returnQty >= item.quantity}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 font-medium min-w-[60px] text-center">
                        {isChecked ? `Qty: ${returnQty}` : "—"}
                      </span>
                    )}
                    <span className={`font-semibold min-w-[70px] text-right ${isChecked ? "text-gray-900" : "text-gray-400"}`}>
                      ${formatPrice(lineTotal)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Reason for Refund Input Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <label htmlFor="reason" className="block text-lg font-bold text-gray-900 mb-2">
            Reason for Return
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Please provide brief details for why you are returning these items.
          </p>
          <textarea
            name="reason"
            id="reason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Item defective, ordered wrong size, changed mind..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[100px]"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRefund}
            disabled={isSubmitting || totalReturnItemsCount === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-sm focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-bold">{isSubmitting ? "Processing..." : "Submit Refund"}</p>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundOrder;