import { useState, useEffect } from "react";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";

const RecentlyAddedItems = () => {
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
          image_url: product.image_url,
          description: product.description,
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

  if (loading) return <p className="text-center py-8 text-gray-500">Loading...</p>;

  return (
    <div id="main" className="w-full">
      <h2 id="heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
        Recently Added Items
      </h2>

      <div id="items">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="block group" state={{product}}>
              <li className="flex flex-col items-center justify-center border border-gray-100 bg-white p-6 rounded-lg shadow-sm group-hover:shadow-md transition-shadow h-full">
                <p className="font-semibold text-gray-900 text-lg mb-2 text-center line-clamp-1">
                  {product.name}
                </p>
                <p className="text-gray-600 font-medium">
                  ${formatPrice(product.price)}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentlyAddedItems;