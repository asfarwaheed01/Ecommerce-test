import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    const productWithVariant = selectedVariant
      ? { ...product, selectedVariant }
      : product;

    dispatch(addCart(productWithVariant));
    toast.success("Added to cart");
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  // Sample variants for demonstration
  const sampleVariants = [
    { id: "standard", name: "Standard", price: 0 },
    { id: "premium", name: "Premium", price: 5.99 },
    { id: "deluxe", name: "Deluxe", price: 9.99 },
  ];

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const ShowProduct = () => {
    const isOutOfStock = product.rating?.count < 50;
    const hasVariants = product.category === "electronics";

    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <div className="product-image-container position-relative">
                <img
                  className="img-fluid rounded shadow"
                  src={product.image}
                  alt={product.title}
                  style={{
                    maxWidth: "100%",
                    height: "400px",
                    objectFit: "contain",
                    background: "linear-gradient(45deg, #f8f9fa, #ffffff)",
                    padding: "2rem",
                  }}
                />
                {isOutOfStock && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded">
                    <span className="badge bg-danger fs-5 px-4 py-2">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6 py-5">
              {/* Category Badge */}
              <span className="badge bg-secondary text-uppercase mb-2 px-3 py-2">
                {product.category}
              </span>

              {/* Product Title */}
              <h1 className="display-5 fw-bold text-dark mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="d-flex align-items-center mb-3">
                  <div className="text-warning me-2">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star${
                          i < Math.floor(product.rating.rate) ? "" : "-o"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="fw-semibold me-2">
                    {product.rating.rate}
                  </span>
                  <span className="text-muted">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <h3 className="display-6 fw-bold text-primary mb-0">
                  {formatPrice(product.price)}
                </h3>
                {selectedVariant?.price > 0 && (
                  <p className="text-muted mb-0">
                    +{formatPrice(selectedVariant.price)} for{" "}
                    {selectedVariant.name}
                  </p>
                )}
              </div>

              {/* Variants */}
              {hasVariants && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Select Variant:
                  </label>
                  <select
                    className="form-select"
                    value={selectedVariant?.id || ""}
                    onChange={(e) => {
                      const variant = sampleVariants.find(
                        (v) => v.id === e.target.value
                      );
                      setSelectedVariant(variant);
                    }}
                    disabled={isOutOfStock}
                  >
                    <option value="">Choose a variant</option>
                    {sampleVariants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}{" "}
                        {variant.price > 0 &&
                          `(+${formatPrice(variant.price)})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h5 className="fw-semibold text-dark">Description</h5>
                <p className="lead text-muted">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className={`btn ${
                    isOutOfStock ? "btn-secondary" : "btn-outline-primary"
                  } btn-lg px-4`}
                  onClick={() => addProduct(product)}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? (
                    <>
                      <i className="fas fa-ban me-2"></i>
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add to Cart
                    </>
                  )}
                </button>

                <Link to="/cart" className="btn btn-primary btn-lg px-4">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Go to Cart
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row text-center">
                  <div className="col-4">
                    <i className="fas fa-shipping-fast text-primary mb-2"></i>
                    <p className="small mb-0 fw-semibold">Free Shipping</p>
                  </div>
                  <div className="col-4">
                    <i className="fas fa-undo text-primary mb-2"></i>
                    <p className="small mb-0 fw-semibold">30-Day Returns</p>
                  </div>
                  <div className="col-4">
                    <i className="fas fa-shield-alt text-primary mb-2"></i>
                    <p className="small mb-0 fw-semibold">Secure Payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="d-flex">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="mx-2" style={{ minWidth: "280px" }}>
              <Skeleton height={350} className="rounded" />
            </div>
          ))}
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="d-flex">
          {similarProducts.map((item) => {
            const isOutOfStock = item.rating?.count < 50;
            const hasVariants = item.category === "electronics";

            return (
              <div key={item.id} style={{ minWidth: "280px" }} className="me-3">
                <ProductCard
                  product={item}
                  showVariants={hasVariants}
                  variants={hasVariants ? sampleVariants : []}
                  isOutOfStock={isOutOfStock}
                  showFullDescription={false}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>

        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="fw-bold text-dark mb-0">You may also like</h2>
              <p className="text-muted mb-0">
                Similar products in {product.category}
              </p>
            </div>

            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
              gradient={true}
              gradientColor={[248, 249, 250]}
              gradientWidth={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>

        {/* Mobile Similar Products */}
        <div className="row d-md-none">
          <div className="col-12">
            <h3 className="fw-bold text-dark mb-4">You may also like</h3>
            <div className="row">
              {loading2
                ? [...Array(2)].map((_, index) => (
                    <div key={index} className="col-6 mb-3">
                      <Skeleton height={300} className="rounded" />
                    </div>
                  ))
                : similarProducts.slice(0, 4).map((item) => {
                    const isOutOfStock = item.rating?.count < 50;
                    const hasVariants = item.category === "electronics";

                    return (
                      <ProductCard
                        key={item.id}
                        product={item}
                        showVariants={hasVariants}
                        variants={hasVariants ? sampleVariants : []}
                        isOutOfStock={isOutOfStock}
                        showFullDescription={false}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Product;
