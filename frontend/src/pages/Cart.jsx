import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import '../styles/Cart.css';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, loading } = useCart();

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <FiShoppingBag className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping <FiArrowRight /></Link>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal + tax + shipping;

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({cartItems.length} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const price = item.product.discountPrice || item.product.price;
            return (
              <div key={item.id} className="cart-item">
                <img src={item.product.imageUrl || 'https://via.placeholder.com/100'} alt={item.product.name} />
                <div className="item-details">
                  <Link to={`/products/${item.product.id}`} className="item-name">{item.product.name}</Link>
                  <span className="item-brand">{item.product.brand}</span>
                  <span className="item-price">${price?.toFixed(2)}</span>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><FiPlus /></button>
                </div>
                <span className="item-total">${(price * item.quantity).toFixed(2)}</span>
                <button className="item-remove" onClick={() => removeFromCart(item.product.id)}><FiTrash2 /></button>
              </div>
            );
          })}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link to="/checkout" className="btn-checkout">Proceed to Checkout</Link>
          <Link to="/products" className="btn-continue">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
