import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCartItems([]);
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addToCart(productId, quantity);
      await fetchCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartAPI.updateQuantity(productId, quantity);
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart');
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, loading, cartCount, cartTotal,
      addToCart, updateQuantity, removeFromCart, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
