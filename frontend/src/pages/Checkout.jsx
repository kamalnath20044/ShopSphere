import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingName: '', shippingAddress: '', shippingCity: '',
    shippingState: '', shippingZipCode: '', shippingPhone: '',
    notes: '', paymentMethod: 'COD'
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const tax = cartTotal * 0.08;
  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await orderAPI.placeOrder(form);
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input name="shippingName" value={form.shippingName} onChange={handleChange} required /></div>
            <div className="form-group"><label>Phone</label><input name="shippingPhone" value={form.shippingPhone} onChange={handleChange} required /></div>
          </div>
          <div className="form-group"><label>Address</label><input name="shippingAddress" value={form.shippingAddress} onChange={handleChange} required /></div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input name="shippingCity" value={form.shippingCity} onChange={handleChange} required /></div>
            <div className="form-group"><label>State</label><input name="shippingState" value={form.shippingState} onChange={handleChange} required /></div>
            <div className="form-group"><label>ZIP Code</label><input name="shippingZipCode" value={form.shippingZipCode} onChange={handleChange} required /></div>
          </div>
          <div className="form-group"><label>Notes (optional)</label><textarea name="notes" value={form.notes} onChange={handleChange} rows="3" /></div>

          <h3>Payment Method</h3>
          <div className="payment-options">
            {['COD', 'CREDIT_CARD', 'STRIPE'].map(m => (
              <label key={m} className={`payment-option ${form.paymentMethod === m ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value={m} checked={form.paymentMethod === m} onChange={handleChange} />
                <span>{m === 'COD' ? '💵 Cash on Delivery' : m === 'CREDIT_CARD' ? '💳 Credit Card' : '⚡ Stripe'}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn-place-order" disabled={loading}>
            {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="checkout-item">
              <img src={item.product.imageUrl} alt="" />
              <div>
                <p>{item.product.name}</p>
                <span>Qty: {item.quantity} × ${(item.product.discountPrice || item.product.price)?.toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
