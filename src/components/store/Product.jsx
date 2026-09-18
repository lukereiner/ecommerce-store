import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../Navbar";

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const product = location.state?.product;

  const [isInCart, setIsInCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Check if product is already in user's cart on load
  useEffect(() => {
    const checkCartStatus = async () => {
      if (!user?.id || !product?.id) return;

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
  }, [user?.id, product?.id]);

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

  // Fallback if accessed via direct URL paste without Link state
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Product details are unavailable. Please return to the shop page.
          </p>
          <Link to="/store" className="text-blue-600 hover:underline">
            ← Back to Store
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/store"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>

        {/* Product Details Layout */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Product Image Container */}
          <div className="md:col-span-6 w-full h-80 sm:h-96 bg-gray-50 rounded-lg flex items-center justify-center p-4 overflow-hidden border">
            <img
              className="max-h-full max-w-full object-contain"
              src={`/products/${product.image_url}`}
              alt={product.name}
            />
          </div>

          {/* Product Specs & Add to Cart */}
          <div className="md:col-span-6 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              <div className="text-2xl sm:text-3xl font-semibold text-gray-900">
                ${formatPrice(product.price)}
              </div>

              <div className="border-t border-b border-gray-100 py-4 my-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Add to Cart Button Container */}
            <div className="pt-6 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isInCart || isAdding}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md transition-colors font-medium text-base ${
                  isInCart
                    ? "bg-emerald-600 text-white cursor-default"
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
        </div>
      </div>
    </>
  );
};

export default Product;
