import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const ProductModal = ({ product }) => {
  return (
    <div
      id="main"
      className="flex flex-col justify-between items-center border p-4 rounded-lg shadow-sm w-64 h-full text-center bg-white"
    >

      <div className="w-full h-48 flex items-center justify-center overflow-hidden mb-3">
        <img
          className="max-h-full max-w-full object-contain"
          src={`/products/${product.image_url}`}
          alt={product.name}
        />
      </div>

      <div className="flex flex-col flex-grow justify-start items-center w-full mb-3">
        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="w-full mt-auto flex flex-col items-center gap-2">
        <div className="font-semibold text-lg">
          ${formatPrice(product.price)}
        </div>
        <button className="border border-2 bg-blue-200 px-4 py-1 rounded hover:bg-blue-300 w-full">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductModal;