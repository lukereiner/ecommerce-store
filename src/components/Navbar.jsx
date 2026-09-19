import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  // Fetch cart item quantity on load / user change
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user?.id) {
        setCartCount(0);
        return;
      }

      try {
        const response = await axios.get(`/api/carts/user/${user.id}`);
        const cartItems = response.data.items || [];
        
        // Sum total quantities across all cart items
        const totalQty = cartItems.reduce(
          (sum, item) => sum + (item.quantity || item.qty || 1),
          0
        );
        
        setCartCount(totalQty);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, [user?.id]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
              The General Store
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/members" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Members
            </Link>
            <Link to="/store" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Store
            </Link>
          </div>

          {/* Desktop Cart Icon with Badge */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-blue-600 transition-colors p-2"
              aria-label="Cart"
            >
              <FaShoppingCart size="1.5em" />
              
              {/* CART BADGE */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-3 space-y-1 shadow-lg absolute w-full">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/members"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Members
          </Link>
          <Link
            to="/store"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Store
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <FaShoppingCart className="mr-3" size="1.2em" />
              <span>Cart</span>
            </div>
            
            {/* Mobile Cart Count Badge */}
            {cartCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;