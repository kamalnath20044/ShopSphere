import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login({ username, password });
      login(res.data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="logo-icon">◆</span>
            <h1>ShopSphere</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Your premium shopping experience awaits</p>
          <div className="auth-illustration">🛍️</div>
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your credentials to continue</p>

            <div className="form-group">
              <FiMail className="input-icon" />
              <input type="text" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="form-group">
              <FiLock className="input-icon" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>

            <div className="demo-credentials">
              <p><strong>Demo Admin:</strong> admin / admin123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
