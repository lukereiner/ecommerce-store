import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CartSummary from "../components/cart/CartSummary";
import CartItems from "../components/cart/CartItems";
import Navbar from "../components/Navbar";

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
      // revert state if backend request fails
      setCartItems(previousItems);
    }
  };

  const handleUpdateQty = async (cartItemId, newQty) => {
    if (newQty < 1) return; // do not drop qty below 1

    // Store previous state in case API call fails
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
      // revert state if backend request fails
      setCartItems(previousItems);
    }
  };

  const handleCheckout = async (paymentData) => {
    setIsCheckingOut(true);

    try {
      await axios.post(`/api/carts/user/${user.id}/checkout`, {
        paymentInfo: paymentData || "9099000011114444",
      });

      // clear user cart items in UI
      setCartItems([]);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Fetch products for image url
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

  // Fetch & load cart
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
  }, []);

  return (
    <>
      <section>
        <Navbar />
      </section>

      <section className="flex justify-center mt-4">
        <h1 className="font-bold text-3xl">{user.firstname}'s Cart</h1>
      </section>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-start">
          <div className="md:col-span-7 lg:col-span-8 w-full min-w-0">
            {cartItems.map((item) => {
              // Find the product matching the current cart item's productid
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

          <div className="md:col-span-5 lg:col-span-4 w-full md:sticky md:top-8">
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
