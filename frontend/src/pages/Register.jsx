import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h2>Join Us Today</h2>
          <p>Create your account and start shopping</p>
          <div className="auth-illustration">🚀</div>
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Fill in your details to get started</p>

            <div className="form-group">
              <FiUser className="input-icon" />
              <input name="fullName" type="text" placeholder="Full Name"
                value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <FiUser className="input-icon" />
              <input name="username" type="text" placeholder="Username"
                value={form.username} onChange={handleChange} required minLength={3} />
            </div>
            <div className="form-group">
              <FiMail className="input-icon" />
              <input name="email" type="email" placeholder="Email"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <FiLock className="input-icon" />
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Password"
                value={form.password} onChange={handleChange} required minLength={6} />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
