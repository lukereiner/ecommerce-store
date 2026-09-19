import { useState, useEffect } from "react";
import { formatPrice } from "../../utils/formatPrice";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ProductModal = ({ product }) => {
  const { user } = useAuth();
  const [isInCart, setIsInCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const checkCartStatus = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(`/api/carts/user/${user.id}`);
        const cartItems = response.data.items || [];

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
      className="flex flex-col justify-between items-center border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-full text-center bg-white group"
    >
      {/* Product Image Link */}
      <Link
        to={`/products/${product.id}`}
        state={{ product }}
        className="w-full mb-4 group-hover:opacity-95 transition-opacity"
      >
        <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg p-3 border border-gray-100">
          <img
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            src={`/products/${product.image_url}`}
            alt={product.name}
          />
        </div>
      </Link>

      {/* Title & Description */}
      <div className="flex flex-col flex-grow justify-start items-center w-full mb-4 space-y-1">
        <Link
          to={`/products/${product.id}`}
          state={{ product }}
          className="font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price & Action Button */}
      <div className="w-full mt-auto flex flex-col items-center gap-3 pt-2">
        <div className="font-bold text-xl text-gray-900">
          ${formatPrice(product.price)}
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isInCart || isAdding}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-colors font-medium text-sm shadow-xs ${
            isInCart
              ? "bg-emerald-600 text-white cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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