import { useState, useEffect } from "react";
import axios from "axios";
import ProductModal from "../components/store/ProductModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Store = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Loading store catalog...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Store Catalog</h1>
        </div>

        {/* Responsive Grid Layout */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {products?.map((product) => (
            <ProductModal key={product.id} product={product} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Store;