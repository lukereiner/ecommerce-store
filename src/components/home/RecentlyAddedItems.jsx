import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";

const RecentlyAddedItems = () => {
  const items = [
    { id: 1, name: "Corn" },
    { id: 2, name: "Berries" },
    { id: 3, name: "Peanuts" },
  ];

  const [recentProducts, setRecentProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");

        const adjustedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          created: product.created,
        }));

        const createdSort = [...adjustedProducts].sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );
        const selectedRecent = createdSort.slice(0, 3);

        setRecentProducts(selectedRecent);
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
          Recently Added Items
        </div>

        <div id="items">
          <ul className="flex flex-row gap-4 text-center">
            {recentProducts.map((product) => (
              <Link to="/store">
                <li
                  key={product.id}
                  className="border p-4 rounded shadow-sm content-center"
                >
                  <p className="font-bold">{product.name}</p>
                  <p>${formatPrice(product.price)}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RecentlyAddedItems;
