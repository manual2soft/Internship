import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };
  return (
    <>
      <Link
        key={product.id}
        to={`/product/${product.id}`}
        className="glass-card hover:glow-on-hover animate-smooth group"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {new Date() - new Date(product.created_at) <
              30 * 24 * 60 * 60 * 1000 && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {product.ratings >= 4.5 && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                Top - Rated
              </span>
            )}
          </div>

          {/* Quick Add to Cart */}
          <button
            onClick={(e) => handleAddToCart(product, e)}
            className="absolute bottom-3 right-3 p-2 glass-card hover:glow-on-hover animate-smooth opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Product Info */}
        <div>
          {/* Product Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Product Ratings */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                return (
                  <Star
                    key={i}
                    className={`w-4 h-4
                            ${
                              i < Math.floor(product.ratings)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }
                          `}
                  />
                );
              })}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.review_count})
            </span>
          </div>

          {/* Product Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              ₹{product.price}
            </span>
          </div>

          {/* Product Availability */}
          <div className="mt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${product.stock > 5 ? "bg-green-500/20 text-green-400" : product.stock > 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}
            >
              {product.stock > 5
                ? "In Stock"
                : product.stock > 0
                  ? "Limited Stock"
                  : "Out of Stock"}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
