import { formatPrice } from "../../utils/formatPrice";
import SquareCheckout from "./SquareCheckout";

const CartSummary = ({ subtotal, tax, total, userId, onSuccess }) => {
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
          <span className="font-semibold text-gray-900">
            ${formatPrice(tax)}
          </span>
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
      <SquareCheckout
        disabled={subtotal === 0}
        userId={userId}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default CartSummary;
