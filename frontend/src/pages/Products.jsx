import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import '../styles/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, sortDir, searchQuery, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let res;
      if (searchQuery) {
        res = await productAPI.search(searchQuery, page, 12);
      } else if (categoryFilter) {
        res = await productAPI.getByCategory(categoryFilter, page, 12);
      } else {
        res = await productAPI.getAll(page, 12, sortBy, sortDir);
      }
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    setPage(0);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>{searchQuery ? `Search: "${searchQuery}"` : categoryFilter ? 'Category Products' : 'All Products'}</h1>
        <div className="products-controls">
          <select value={sortBy + '-' + sortDir} onChange={(e) => {
            const [s, d] = e.target.value.split('-');
            setSortBy(s); setSortDir(d); setPage(0);
          }}>
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      <div className="products-layout">
        <aside className="products-sidebar">
          <h3><FiFilter /> Filters</h3>
          <div className="filter-group">
            <h4>Categories</h4>
            <button className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}>All</button>
            {categories.map((cat) => (
              <button key={cat.id}
                className={`filter-btn ${categoryFilter == cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="products-main">
          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="no-results">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
