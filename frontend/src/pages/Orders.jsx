import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import '../styles/Orders.css';

const statusIcons = {
  PENDING: <FiClock />, CONFIRMED: <FiCheck />, PROCESSING: <FiPackage />,
  SHIPPED: <FiTruck />, DELIVERED: <FiCheck />, CANCELLED: <FiX />, REFUNDED: <FiX />
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getUserOrders();
        setOrders(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(id);
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o));
    } catch (err) { alert(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <FiPackage className="empty-icon" />
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-number">{order.orderNumber}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`order-status status-${order.status?.toLowerCase()}`}>
                {statusIcons[order.status]} {order.status}
              </span>
            </div>
            <div className="order-items">
              {order.items?.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.product?.imageUrl} alt="" />
                  <div>
                    <p>{item.productName}</p>
                    <span>Qty: {item.quantity} × ${item.price?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span className="order-total">Total: ${order.totalAmount?.toFixed(2)}</span>
              {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                <button className="btn-cancel" onClick={() => handleCancel(order.id)}>Cancel Order</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
