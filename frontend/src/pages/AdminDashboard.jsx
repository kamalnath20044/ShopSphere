import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTruck, FiCheck } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import '../styles/Admin.css';

const TABS = ['Overview', 'Products', 'Orders', 'Users'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllOrders(0, 50),
        adminAPI.getAllUsers(),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.content || []);
      setUsers(usersRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      fetchDashboard();
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const chartData = stats?.monthlySales ? Object.entries(stats.monthlySales).map(([month, total]) => ({
    name: MONTHS[parseInt(month) - 1], sales: parseFloat(total)
  })) : [];

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>⚙️ Admin Panel</h2>
        {TABS.map(t => (
          <button key={t} className={`sidebar-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'Overview' && (
          <>
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card purple"><FiUsers /><div><h3>{stats?.totalUsers || 0}</h3><p>Total Users</p></div></div>
              <div className="stat-card blue"><FiPackage /><div><h3>{stats?.totalProducts || 0}</h3><p>Products</p></div></div>
              <div className="stat-card orange"><FiShoppingCart /><div><h3>{stats?.totalOrders || 0}</h3><p>Total Orders</p></div></div>
              <div className="stat-card green"><FiDollarSign /><div><h3>${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3><p>Revenue</p></div></div>
              <div className="stat-card yellow"><FiTruck /><div><h3>{stats?.pendingOrders || 0}</h3><p>Pending</p></div></div>
              <div className="stat-card teal"><FiCheck /><div><h3>{stats?.deliveredOrders || 0}</h3><p>Delivered</p></div></div>
            </div>
            {chartData.length > 0 && (
              <div className="chart-container">
                <h3>Monthly Sales ({new Date().getFullYear()})</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="sales" fill="url(#gradient)" radius={[6,6,0,0]} />
                    <defs><linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {tab === 'Orders' && (
          <>
            <h1>Order Management</h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.user?.username}</td>
                      <td>${order.totalAmount?.toFixed(2)}</td>
                      <td><span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)}>
                          {['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'Users' && (
          <>
            <h1>User Management</h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Full Name</th><th>Roles</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.fullName || '-'}</td>
                      <td>{u.roles?.map(r => r.name).join(', ')}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'Products' && (
          <>
            <h1>Product Management</h1>
            <p className="admin-info">Product management available via API. Use Swagger UI at <a href="http://localhost:8080/swagger-ui.html" target="_blank">localhost:8080/swagger-ui.html</a></p>
          </>
        )}
      </div>
    </div>
  );
}
