import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductModal from "../components/store/ProductModal";

const Store = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");

        const adjustedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
        }));

        setProducts(adjustedProducts);
        //console.log('store page', adjustedProducts)
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
      <div>
        <section>
          <h1 className="text-2xl font-bold text-center my-4">Store Main</h1>
        </section>

        <section className="flex flex-wrap gap-4 justify-center">
          {products.map((product) => (
            <ProductModal key={product.id} product={product} />
          ))}
        </section>
      </div>
    </>
  );
};

export default Store;
