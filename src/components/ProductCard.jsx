import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({
  product,
  showVariants = false,
  variants = [],
  isOutOfStock = false,
  showFullDescription = false,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0] : null
  );

  const dispatch = useDispatch();

  const addProduct = (productToAdd) => {
    const productWithVariant = selectedVariant
      ? { ...productToAdd, selectedVariant }
      : productToAdd;

    dispatch(addCart(productWithVariant));
  };

  const handleAddToCart = () => {
    if (outOfStock) return;

    toast.success("Added to cart");
    addProduct(product);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const checkStockStatus = () => {
    if (isOutOfStock) return true;
    return product.rating && product.rating.count < 100;
  };

  const outOfStock = checkStockStatus();

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        {/* Product Image */}
        <div className="card-img-container position-relative overflow-hidden">
          <img
            className="card-img-top product-image"
            src={product.image}
            alt={product.title}
            style={{
              height: "250px",
              objectFit: "contain",
              padding: "1rem",
              transition: "transform 0.3s ease",
            }}
          />
          {outOfStock && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
              <span className="badge bg-danger fs-6 px-3 py-2">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          {/* Product Title */}
          <h5
            className="card-title fw-bold text-dark mb-2"
            style={{ minHeight: "3rem" }}
          >
            {showFullDescription
              ? product.title
              : truncateText(product.title, 60)}
          </h5>

          {/* Product Description */}
          <p
            className="card-text text-muted small flex-grow-1"
            style={{ minHeight: "4rem" }}
          >
            {showFullDescription
              ? product.description
              : truncateText(product.description, 100)}
          </p>

          {/* Product Rating */}
          <div className="text-warning me-2">
            {[...Array(5)].map((_, i) => {
              const full = i < Math.floor(product.rating.rate);
              const half = !full && i < product.rating.rate;
              return (
                <i
                  key={i}
                  className={
                    full
                      ? "fas fa-star"
                      : half
                      ? "fas fa-star-half-alt"
                      : "far fa-star"
                  }
                ></i>
              );
            })}
          </div>

          {/* Variants Dropdown */}
          {showVariants && variants.length > 0 && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">
                Select Variant:
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedVariant?.id || ""}
                onChange={(e) => {
                  const variant = variants.find((v) => v.id === e.target.value);
                  setSelectedVariant(variant);
                }}
                disabled={outOfStock}
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}{" "}
                    {variant.price && `(+${formatPrice(variant.price)})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price */}
          <div className="mb-3">
            <span className="h4 fw-bold text-black">
              {formatPrice(product.price)}
            </span>
            {selectedVariant?.price > 0 && (
              <span className="text-muted ms-2 small">
                (+{formatPrice(selectedVariant.price)})
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-auto">
            <div className="d-grid gap-2">
              <Link
                to={`/product/${product.id}`}
                className="btn btn-outline-dark btn-sm"
              >
                <i className="fas fa-eye me-2"></i>
                View Details
              </Link>

              <button
                className={`btn btn-sm ${
                  outOfStock ? "btn-secondary" : "btn-dark"
                }`}
                onClick={handleAddToCart}
                disabled={outOfStock}
              >
                {outOfStock ? (
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
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .card-img-container {
          background: linear-gradient(45deg, #f8f9fa, #ffffff);
        }

        @media (max-width: 576px) {
          .product-card .card-body {
            padding: 1rem 0.75rem;
          }

          .product-card .card-title {
            font-size: 1rem;
            min-height: 2.5rem;
          }

          .product-card .card-text {
            min-height: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
