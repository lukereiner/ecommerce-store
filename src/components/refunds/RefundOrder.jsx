import Navbar from "../Navbar";
import Footer from "../Footer";
import { useParams, Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { useState } from "react";

const RefundOrder = () => {
  // Store selected item refund quantities in a key-value object: { [itemId]: quantityToReturn }
  const [refundQuantities, setRefundQuantities] = useState({});

  const { orderId } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  // Toggle item check/uncheck
  const handleToggle = (item) => {
    setRefundQuantities((prev) => {
      const updated = { ...prev };
      if (updated[item.id] !== undefined) {
        delete updated[item.id];
      } else {
        // Default to returning the full purchased quantity upon checking
        updated[item.id] = item.quantity;
      }
      return updated;
    });
  };

  // Increment / Decrement quantity for checked items
  const handleQtyChange = (itemId, maxQty, delta) => {
    setRefundQuantities((prev) => {
      const currentQty = prev[itemId] || 1;
      const newQty = Math.max(1, Math.min(maxQty, currentQty + delta));
      return { ...prev, [itemId]: newQty };
    });
  };

  // Fallback UI if someone navigates directly via URL
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">
              Refund data is not available. Please navigate from your order
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

  // --- Dynamic Financial Calculations ---
  const selectedItemIds = Object.keys(refundQuantities).map(Number);
  const totalReturnItemsCount = selectedItemIds.length;

  const totalReturnQty = Object.values(refundQuantities).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  // 1. Subtotal in cents (Math.round(price * 100) * qty)
  const subtotalCents =
    order.items?.reduce((sum, item) => {
      const returnQty = refundQuantities[item.id] || 0;
      const itemPriceCents = Math.round(Number(item.price) * 100);
      return sum + itemPriceCents * returnQty;
    }, 0) || 0;

  // 2. Tax in cents using 7% tax rate (Math.round(subtotalCents * 0.07))
  const TAX_RATE = 0.07;
  const taxCents = Math.round(subtotalCents * TAX_RATE);

  // 3. Total in cents
  const totalCents = subtotalCents + taxCents;

  // 4. Convert back to dollars for display
  const calculatedSubtotal = subtotalCents / 100;
  const calculatedTax = taxCents / 100;
  const calculatedTotal = totalCents / 100;

  console.log(refundQuantities)

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Back Link */}
        <Link
          to={`/orders/${order.id}`}
          state={{ order }}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          ← Back to order
        </Link>

        {/* Header & Summary Card */}
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

          {/* Dynamic Details Grid */}
          <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
            <div className="text-left">
              <span className="block text-gray-500 text-xs">Return Items</span>
              <span className="font-semibold text-gray-900">
                {totalReturnItemsCount}
              </span>
            </div>

            <div className="text-center">
              <span className="block text-gray-500 text-xs">Return Qty</span>
              <span className="font-semibold text-gray-900">
                {totalReturnQty}
              </span>
            </div>

            <div className="text-center">
              <span className="block text-gray-500 text-xs">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${formatPrice(calculatedSubtotal)}
              </span>
            </div>

            <div className="text-center">
              <span className="block text-gray-500 text-xs">Tax</span>
              <span className="font-semibold text-gray-900">
                ${formatPrice(calculatedTax)}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-gray-500 text-xs">Total Refund</span>
              <span className="font-bold text-gray-900">
                ${formatPrice(calculatedTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Items to Return
          </h2>

          <ul className="divide-y divide-gray-100">
            {order.items?.map((item) => {
              const isChecked = refundQuantities[item.id] !== undefined;
              const returnQty = refundQuantities[item.id] || 0;
              const lineTotal = isChecked
                ? Number(item.price) * returnQty
                : Number(item.price);

              return (
                <li
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
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
                      <span className="text-xs text-gray-500 block">
                        Purchased: {item.quantity} (${formatPrice(item.price)}{" "}
                        ea)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Quantity Controller (Only visible if checked & item.quantity > 1) */}
                    {isChecked && item.quantity > 1 ? (
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-xs">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity, -1)
                          }
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
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity, 1)
                          }
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

                    {/* Calculated Line Item Price */}
                    <span
                      className={`font-semibold min-w-[70px] text-right ${
                        isChecked ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      ${formatPrice(lineTotal)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-center">
          <button className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-sm focus:outline-none cursor-pointer">
            <p className="font-bold">Submit Refund</p>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundOrder;
