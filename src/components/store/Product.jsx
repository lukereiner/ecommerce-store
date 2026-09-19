import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Product = () => {
  const location = useLocation();
  const { user } = useAuth();

  const product = location.state?.product;

  const [isInCart, setIsInCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
            <p className="text-gray-600">
              Product details are unavailable. Please return to the shop page.
            </p>
            <Link
              to="/store"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              ← Back to Store
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/store"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>

        {/* Product Details Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Product Image Container */}
          <div className="md:col-span-6 w-full h-80 sm:h-96 bg-gray-50 rounded-lg flex items-center justify-center p-6 overflow-hidden border border-gray-100">
            <img
              className="max-h-full max-w-full object-contain"
              src={`/products/${product.image_url}`}
              alt={product.name}
            />
          </div>

          {/* Product Specs & Add to Cart */}
          <div className="md:col-span-6 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                ${formatPrice(product.price)}
              </div>

              <div className="border-t border-b border-gray-100 py-4 space-y-2">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Description
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Add to Cart Button Container */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isInCart || isAdding}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md transition-colors font-semibold text-base shadow-sm ${
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;