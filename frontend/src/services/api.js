import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Products
export const productAPI = {
  getAll: (page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get(`/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId, page = 0, size = 12) =>
    api.get(`/products/category/${categoryId}?page=${page}&size=${size}`),
  search: (keyword, page = 0, size = 12) =>
    api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}`),
  getFeatured: () => api.get('/products/featured'),
  getRecommendations: (id) => api.get(`/products/${id}/recommendations`),
};

// Categories
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Cart
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  updateQuantity: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Orders
export const orderAPI = {
  placeOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
};

// Wishlist
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
  isInWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getAllOrders: (page = 0, size = 20) => api.get(`/admin/orders?page=${page}&size=${size}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getAllUsers: () => api.get('/admin/users'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
};

export default api;
