import { formatPrice } from "../../utils/formatPrice";

const CartItems = ({ item, product, onUpdateQty, onDeleteItem }) => {
  return (
    <div className="flex items-center justify-between py-4 gap-3 sm:gap-4 w-full first:pt-0 last:pb-0">
      {/* 1. DELETE BUTTON */}
      <button
        className="text-gray-400 hover:text-red-500 font-bold p-1 rounded transition-colors flex-shrink-0"
        title="Remove item"
        onClick={() => onDeleteItem(item.id)}
      >
        ✕
      </button>

      {/* 2. ITEM PHOTO */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 overflow-hidden p-2">
        <img
          className="max-h-full max-w-full object-contain"
          src={`/products/${product?.image_url}`}
          alt={item.name}
        />
      </div>

      {/* 3. NAME & DETAILS */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 font-medium">
          ${formatPrice(item.price)} each
        </p>
      </div>

      {/* 4. QUANTITY CONTROLLER */}
      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden shadow-xs">
        <button
          className="px-2.5 py-1 text-sm hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
          onClick={() => onUpdateQty(item.id, item.qty - 1)}
          disabled={item.qty <= 1}
        >
          -
        </button>
        <span className="px-2 py-1 text-xs sm:text-sm font-semibold text-gray-800 min-w-[20px] text-center">
          {item.qty}
        </span>
        <button
          className="px-2.5 py-1 text-sm hover:bg-gray-200 text-gray-600 transition-colors"
          onClick={() => onUpdateQty(item.id, item.qty + 1)}
        >
          +
        </button>
      </div>

      {/* 5. PRICE CALCULATION */}
      <div className="w-20 sm:w-24 flex-shrink-0 text-right">
        <span className="text-sm sm:text-base font-bold text-gray-900 block">
          ${formatPrice(item.qty * Number(item.price))}
        </span>
      </div>
    </div>
  );
};

export default CartItems;