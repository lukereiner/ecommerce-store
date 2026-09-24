import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CartSummary from "../components/cart/CartSummary";
import CartItems from "../components/cart/CartItems";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const calculateTotals = (subtotal, taxRate = 0.07) => {
  const subtotalCents = Math.round(subtotal * 100);
  const taxCents = Math.round(subtotalCents * taxRate);

  return {
    tax: taxCents / 100,
    total: (subtotalCents + taxCents) / 100,
  };
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [products, setProducts] = useState(null);

  const { user } = useAuth();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * Number(item.price),
    0,
  );

  const { tax, total } = calculateTotals(subtotal);

  const handleDeleteItem = async (cartItemId) => {
    const previousItems = [...cartItems];

    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== cartItemId),
    );

    try {
      await axios.delete(`/api/carts/user/${user.id}/items/${cartItemId}`);
    } catch (error) {
      console.error("Failed to delete item in cart:", error);
      setCartItems(previousItems);
    }
  };

  const handleUpdateQty = async (cartItemId, newQty) => {
    if (newQty < 1) return;

    const previousItems = [...cartItems];

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, qty: newQty } : item,
      ),
    );

    try {
      await axios.patch(`/api/carts/user/${user.id}/items/${cartItemId}`, {
        qty: newQty,
      });
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      setCartItems(previousItems);
    }
  };

  const handleSuccess = () => {
    setCartItems([]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");

        const adjustedProducts = response.data.map((product) => ({
          id: product.id,
          image_url: product.image_url,
          name: product.name,
          price: product.price,
          description: product.description,
        }));

        setProducts(adjustedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/carts/user/${user.id}`);
        const responseItems = response.data.items;

        const adjustedItems = responseItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          qty: item.qty,
          productid: item.productid,
        }));

        setCartItems(adjustedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user?.id]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.firstname ? `${user.firstname}'s Cart` : "Shopping Cart"}
          </h1>
        </div>

        {cartItems.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center space-y-4">
            <p className="text-gray-500 font-medium">
              Your shopping cart is empty.
            </p>
            <Link
              to="/store"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Cart Items List Container */}
            <div className="md:col-span-7 lg:col-span-8 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 divide-y divide-gray-100">
              {cartItems.map((item) => {
                const matchedProduct = products?.find(
                  (p) => p.id === item.productid,
                );

                return (
                  <CartItems
                    key={item.id}
                    item={item}
                    product={matchedProduct}
                    onUpdateQty={handleUpdateQty}
                    onDeleteItem={handleDeleteItem}
                  />
                );
              })}
            </div>

            {/* Cart Summary Container */}
            <div className="md:col-span-5 lg:col-span-4 w-full md:sticky md:top-24">
              <CartSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                userId={user.id}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
