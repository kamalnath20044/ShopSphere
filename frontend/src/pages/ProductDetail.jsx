import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [prodRes, recRes] = await Promise.all([
          productAPI.getById(id),
          productAPI.getRecommendations(id),
        ]);
        setProduct(prodRes.data);
        setRecommendations(recRes.data);
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!product) return <div className="not-found"><h2>Product not found</h2></div>;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="detail-image">
          <img src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'} alt={product.name} />
          {hasDiscount && (
            <span className="detail-discount">
              -{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </span>
          )}
        </div>

        <div className="detail-info">
          <span className="detail-brand">{product.brand}</span>
          <h1>{product.name}</h1>

          <div className="detail-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.round(product.rating) ? 'filled' : ''} />
              ))}
            </div>
            <span>{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>

          <div className="detail-price">
            <span className="current">${price?.toFixed(2)}</span>
            {hasDiscount && <span className="original">${product.price?.toFixed(2)}</span>}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-meta">
            <span className="meta-item"><FiTruck /> Free shipping on $100+</span>
            <span className="meta-item"><FiShield /> 1-year warranty</span>
          </div>

          <div className="detail-stock">
            {product.stockQuantity > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="out-stock">✗ Out of Stock</span>
            )}
          </div>

          {product.stockQuantity > 0 && (
            <div className="detail-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}><FiPlus /></button>
              </div>
              <button className="btn-add-cart" onClick={() => {
                if (!user) { toast.error('Please login first'); return; }
                addToCart(product.id, quantity);
              }}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn-wishlist" onClick={async () => {
                if (!user) { toast.error('Please login first'); return; }
                try {
                  await wishlistAPI.addToWishlist(product.id);
                  toast.success('Added to wishlist!');
                } catch { toast.error('Failed'); }
              }}>
                <FiHeart />
              </button>
            </div>
          )}

          <div className="detail-category">
            <strong>Category:</strong> {product.categoryName || 'Uncategorized'}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="recommendations">
          <h2>You May Also Like</h2>
          <div className="products-grid">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
