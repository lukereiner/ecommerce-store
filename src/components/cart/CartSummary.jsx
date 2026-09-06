import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const CartSummary = ({ subtotal }) => {
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

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
      <button className="w-full bg-black text-white py-3 sm:py-3.5 rounded-md font-medium text-xs sm:text-sm hover:bg-gray-800 transition-colors shadow-sm">
        Check Out
      </button>
    </div>
  );
};

export default CartSummary;