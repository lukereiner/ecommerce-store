import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const CartSummary = ({ subtotal, tax, total, onCheckout, isCheckingOut }) => {

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100 box-border">
      {/* SECTION TITLE */}
      <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-gray-900">
        Summary
      </h2>

      {/* COST BREAKDOWN */}
      <div className="space-y-3 text-xs sm:text-sm border-b border-gray-200 pb-4 sm:pb-6">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">
            ${formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Estimated Tax (7%)</span>
          <span className="font-medium text-gray-900">${formatPrice(tax)}</span>
        </div>
      </div>

      {/* TOTAL AMOUNT */}
      <div className="flex justify-between items-center pt-4 sm:pt-6 pb-4 sm:pb-6 text-xs sm:text-sm">
        <span className="font-bold text-gray-900">Total</span>
        <div className="text-right">
          <span className="text-[10px] sm:text-xs text-gray-400 mr-1 uppercase font-medium">
            USD
          </span>
          <span className="font-bold text-sm sm:text-base text-gray-900">
            ${formatPrice(total)}
          </span>
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <button
        onClick={() => onCheckout()}
        disabled={isCheckingOut || subtotal === 0}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
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
