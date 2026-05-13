import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../styles/Wishlist.css';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.getWishlist();
      setItems(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setItems(items.filter(i => i.product.id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <FiHeart className="empty-icon" />
        <h2>Your wishlist is empty</h2>
        <p>Save products you love for later.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist ({items.length} items)</h1>
      <div className="wishlist-grid">
        {items.map(item => (
          <div key={item.id} className="wishlist-card">
            <Link to={`/products/${item.product.id}`}>
              <img src={item.product.imageUrl} alt={item.product.name} />
            </Link>
            <div className="wishlist-info">
              <Link to={`/products/${item.product.id}`}><h3>{item.product.name}</h3></Link>
              <span className="wishlist-brand">{item.product.brand}</span>
              <span className="wishlist-price">${(item.product.discountPrice || item.product.price)?.toFixed(2)}</span>
              <div className="wishlist-actions">
                <button onClick={() => { addToCart(item.product.id); handleRemove(item.product.id); }} className="btn-add"><FiShoppingCart /> Add to Cart</button>
                <button onClick={() => handleRemove(item.product.id)} className="btn-remove"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
