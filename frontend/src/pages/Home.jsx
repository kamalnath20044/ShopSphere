import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight } from 'react-icons/fi';
import '../styles/Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll(),
        ]);
        setFeatured(featRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to fetch home data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🔥 New Arrivals</div>
          <h1>Discover Premium Products at <span className="gradient-text">Unbeatable Prices</span></h1>
          <p>Explore thousands of curated products from top brands. Fast delivery, secure payments, and unmatched quality.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?featured=true" className="btn-secondary">View Deals</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Products</span></div>
            <div className="stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="stat"><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow"></div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card"><FiTruck /><h3>Free Shipping</h3><p>On orders over $100</p></div>
          <div className="feature-card"><FiShield /><h3>Secure Payment</h3><p>100% protected checkout</p></div>
          <div className="feature-card"><FiRefreshCw /><h3>Easy Returns</h3><p>30-day return policy</p></div>
          <div className="feature-card"><FiHeadphones /><h3>24/7 Support</h3><p>Dedicated help center</p></div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/products" className="view-all">View All <FiArrowRight /></Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card">
              <div className="category-icon">{getCategoryEmoji(cat.name)}</div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all">View All <FiArrowRight /></Link>
        </div>
        <div className="products-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to start shopping?</h2>
          <p>Join thousands of satisfied customers and discover products you'll love.</p>
          <Link to="/register" className="btn-primary">Create Account <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}

function getCategoryEmoji(name) {
  const map = { 'Electronics': '📱', 'Fashion': '👗', 'Home & Living': '🏠', 'Books': '📚', 'Sports & Fitness': '🏋️' };
  return map[name] || '🛍️';
}
