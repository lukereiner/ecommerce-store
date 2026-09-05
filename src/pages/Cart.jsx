import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CartSummary from "../components/cart/CartSummary";
import CartItems from "../components/cart/CartItems";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState(null);

  const { user } = useAuth();

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
        Cart page! You are logged in using the protected route. If you aren't
        logged in, you shouldn't be seeing this!
      </section>

      <section>
        <h1 className="font-bold text-3xl underline decoration-solid">
          {user.firstname}'s Cart
        </h1>
      </section>

      <section>
        {cartItems.map((item) => {
          // Find the product matching the current cart item's productid
          const matchedProduct = products?.find((p) => p.id === item.productid);

          return (
            <CartItems
              key={item.productid}
              item={item}
              product={matchedProduct}
            />
          );
        })}
      </section>

      <section>
        <div className="font-bold">Summary</div>
        <CartSummary />
      </section>

      <section>insert cart items modal here to show items</section>
    </>
  );
};

export default Cart;
