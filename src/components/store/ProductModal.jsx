import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/formatPrice";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ProductModal = ({ product }) => {
  const { user } = useAuth();
  const [isInCart, setIsInCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const checkCartStatus = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(`api/carts/user/${user.id}`);
        const cartItems = response.data.items || [];

        // Check if current product matches any item in cart
        const exists = cartItems.some((item) => item.productid === product.id);
        setIsInCart(exists);
      } catch (error) {
        console.error("Error checking cart status:", error);
      }
    };

    checkCartStatus();
  }, [user?.id, product.id]);

  const handleAddToCart = async () => {
    if (isInCart || isAdding) return;

    setIsAdding(true);

    try {
      await axios.post(`/api/carts/user/${user.id}/items`, {
        productId: product.id,
        qty: 1,
      });

      setIsInCart(true);
    } catch (error) {
      console.error("Add item to cart failed:", error);
      alert("Adding item to cart failed. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

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
        <button
          onClick={handleAddToCart}
          disabled={isInCart || isAdding}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors font-medium ${
            isInCart
              ? "bg-blue-300 text-white cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          }`}
        >
          {isInCart
            ? "Added - In Cart"
            : isAdding
              ? "Adding..."
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
