import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3><span className="logo-icon">◆</span> ShopSphere</h3>
          <p>Your one-stop destination for premium products at unbeatable prices. Quality guaranteed.</p>
          <div className="social-links">
            <a href="#" aria-label="GitHub"><FiGithub /></a>
            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div className="footer-section">
          <h4>Categories</h4>
          <Link to="/products?category=1">Electronics</Link>
          <Link to="/products?category=2">Fashion</Link>
          <Link to="/products?category=3">Home & Living</Link>
          <Link to="/products?category=4">Books</Link>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><FiMail /> support@shopsphere.com</p>
          <p><FiPhone /> +1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 ShopSphere. All rights reserved. Built with ❤️ using React & Spring Boot.</p>
      </div>
    </footer>
  );
}
