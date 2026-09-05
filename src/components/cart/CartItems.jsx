import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const CartItems = ({ item, product }) => {
  return (
    <div className="flex items-center justify-between border-b py-4 gap-4 w-full bg-white">
      {/* 1. DELETE BUTTON */}
      <button 
        className="text-gray-400 hover:text-gray-600 font-bold px-2 py-1 text-sm transition-colors flex-shrink-0"
        title="Remove item"
      >
        ✕
      </button>

      {/* 2. ITEM PHOTO */}
      <div className="w-16 h-20 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
        <img
          className="max-h-full max-w-full object-contain"
          src={`/products/${product?.image_url}`}
          alt={item.name}
        />
      </div>

      {/* 3. NAME & DETAILS (Expands to fill middle space) */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="font-medium text-sm text-gray-900 truncate">
          {item.name}
        </h3>
      </div>

      {/* 4. QUANTITY CONTROLLER (Locked width & position) */}
      <div className="flex items-center border rounded bg-gray-50 flex-shrink-0">
        <button className="px-2 py-0.5 text-sm hover:bg-gray-200 text-gray-600">-</button>
        <span className="px-1 py-0.5 text-sm font-medium">{item.qty}</span>
        <button className="px-2 py-0.5 text-sm hover:bg-gray-200 text-gray-600">+</button>
      </div>

      {/* 5. PRICE CALCULATION (Fixed width locks layout alignment) */}
      <div className="w-32 flex-shrink-0 text-right">
        <span className="text-sm font-semibold text-gray-900">
          {item.qty} × ${formatPrice(item.price)}
        </span>
      </div>
    </div>
  );
};

export default CartItems;