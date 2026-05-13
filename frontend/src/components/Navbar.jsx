import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiPackage, FiLogOut, FiGrid } from 'react-icons/fi';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">ShopSphere</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>Products</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="nav-link icon-link" title="Wishlist">
                <FiHeart />
              </Link>
              <Link to="/cart" className="nav-link icon-link cart-link" title="Cart">
                <FiShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="profile-dropdown">
                <button className="nav-link icon-link profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <FiUser />
                  <span className="profile-name">{user.username}</span>
                </button>
                {profileOpen && (
                  <div className="dropdown-menu" onClick={() => setProfileOpen(false)}>
                    <Link to="/orders" className="dropdown-item"><FiPackage /> My Orders</Link>
                    <Link to="/wishlist" className="dropdown-item"><FiHeart /> Wishlist</Link>
                    {isAdmin() && <Link to="/admin" className="dropdown-item"><FiGrid /> Admin Dashboard</Link>}
                    <button className="dropdown-item logout-btn" onClick={() => { logout(); navigate('/'); }}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link login-btn">Login</Link>
              <Link to="/register" className="nav-link register-btn">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
