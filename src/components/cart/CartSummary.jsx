import { formatPrice } from "../../utils/formatPrice";

const CartSummary = ({ subtotal, tax, total, onCheckout, isCheckingOut }) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm box-border space-y-6">
      {/* SECTION TITLE */}
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
        Order Summary
      </h2>

      {/* COST BREAKDOWN */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">
            ${formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Estimated Tax (7%)</span>
          <span className="font-semibold text-gray-900">${formatPrice(tax)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        {/* TOTAL AMOUNT */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-base text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-xs text-gray-400 mr-1.5 uppercase font-medium">
              USD
            </span>
            <span className="font-bold text-lg text-gray-900">
              ${formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <button
        onClick={() => onCheckout()}
        disabled={isCheckingOut || subtotal === 0}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold shadow-sm focus:outline-none"
      >
        {isCheckingOut ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          "Checkout"
        )}
      </button>
    </div>
  );
};

export default CartSummary;