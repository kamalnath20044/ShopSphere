import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { wishlistAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product.id);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      await wishlistAPI.addToWishlist(product.id);
      toast.success('Added to wishlist!');
    } catch {
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {hasDiscount && <span className="discount-badge">-{discountPercent}%</span>}
      <div className="card-image">
        <img src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} alt={product.name} loading="lazy" />
        <div className="card-overlay">
          <button className="overlay-btn" onClick={handleAddToCart} title="Add to Cart"><FiShoppingCart /></button>
          <button className="overlay-btn" onClick={handleWishlist} title="Add to Wishlist"><FiHeart /></button>
        </div>
      </div>
      <div className="card-info">
        <span className="card-brand">{product.brand}</span>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-rating">
          <FiStar className="star-icon" />
          <span>{product.rating?.toFixed(1)}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>
        <div className="card-price">
          <span className="current-price">${price?.toFixed(2)}</span>
          {hasDiscount && <span className="original-price">${product.price?.toFixed(2)}</span>}
        </div>
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="low-stock">Only {product.stockQuantity} left!</span>
        )}
        {product.stockQuantity === 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>
    </Link>
  );
}
