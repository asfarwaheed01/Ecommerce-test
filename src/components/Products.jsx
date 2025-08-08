import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <Skeleton height={400} className="rounded" />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2 px-3"
            onClick={() => setFilter(data)}
          >
            All Products
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-3"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-3"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-3"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelry
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-3"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        <div className="row">
          {filter.map((product, index) => {
            // Example of how to handle variants and stock status
            const sampleVariants = [
              { id: "standard", name: "Standard", price: 0 },
              { id: "premium", name: "Premium", price: 5.99 },
              { id: "deluxe", name: "Deluxe", price: 9.99 },
            ];

            // Simulate some products being out of stock based on low rating count
            const isOutOfStock = product.rating && product.rating.count < 100;

            // Show variants for electronics category (only)
            const shouldShowVariants = product.category === "electronics";

            return (
              <ProductCard
                key={product.id}
                product={product}
                showVariants={shouldShowVariants}
                variants={shouldShowVariants ? sampleVariants : []}
                isOutOfStock={isOutOfStock}
                showFullDescription={false}
              />
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center fw-bold text-dark">
              Latest Products
            </h2>
            <p className="text-center text-muted mb-4">
              Discover our curated collection of premium products
            </p>
            <hr className="mx-auto" style={{ width: "100px", height: "3px" }} />
          </div>
        </div>

        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
