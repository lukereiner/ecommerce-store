import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";

const FeaturedItems = () => {

  const [featuredProducts, setFeaturedProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");

        const adjustedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
        }));

        const shuffled = [...adjustedProducts].sort(() => 0.5 - Math.random());
        const selectedFeatured = shuffled.slice(0,3);

        setFeaturedProducts(selectedFeatured);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div
        id="main"
        className="flex flex-col items-center justify-center w-full py-4"
      >
        <div id="heading" className="text-3xl font-bold mb-4">
          Featured Items
        </div>

        <div id="items">
          <ul className="flex flex-row gap-4 text-center">
            {featuredProducts.map((product) => (
              <li key={product.id} className="border p-4 rounded shadow-sm content-center">
                <p className="font-bold">{product.name}</p>
                <p>${formatPrice(product.price)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FeaturedItems;
