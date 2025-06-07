import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiX,
  FiClock,
  FiFilter,
  FiStar,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const NewArrivalsPage = () => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 500]
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Simulate API fetch
  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProducts = [
        {
          id: 1,
          name: 'Ultra Slim Smartwatch',
          price: 249.99,
          originalPrice: 299.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          category: 'electronics',
          rating: 4.7,
          reviews: 124,
          colors: ['Black', 'Silver', 'Rose Gold'],
          releaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          isNew: true,
          isLimited: true
        },
        {
          id: 2,
          name: 'Noise Cancelling Headphones',
          price: 179.99,
          originalPrice: 229.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          category: 'electronics',
          rating: 4.9,
          reviews: 215,
          colors: ['Black', 'Blue'],
          releaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isBestSeller: true
        },
        {
          id: 3,
          name: 'Wireless Charging Pad',
          price: 39.99,
          originalPrice: 49.99,
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
          category: 'electronics',
          rating: 4.5,
          reviews: 89,
          colors: ['White', 'Black'],
          releaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          isNew: true
        },
        {
          id: 4,
          name: 'Premium Leather Wallet',
          price: 59.99,
          originalPrice: 79.99,
          image: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&w=800&q=80',
          category: 'fashion',
          rating: 4.8,
          reviews: 156,
          colors: ['Brown', 'Black'],
          releaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isLimited: true
        },
        {
          id: 5,
          name: 'Wireless Earbuds Pro',
          price: 179.99,
          originalPrice: 229.99,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
          category: 'electronics',
          rating: 4.9,
          reviews: 215,
          colors: ['White', 'Black'],
          releaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isBestSeller: true
        }
      ];
      
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchNewArrivals();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter(product => {
    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case 'newest':
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getDaysSinceRelease = (date) => {
    const diffTime = new Date() - new Date(date);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our latest products fresh off the production line
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredProducts.length}</span> products
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Mobile Filters Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <FiFilter /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm bg-white w-full"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <FiChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Mobile */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="absolute right-0 top-0 h-full w-4/5 bg-white shadow-lg p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <FiX className="text-2xl" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.value} className="flex items-center">
                        <input
                          id={`category-${category.value}`}
                          type="radio"
                          name="category"
                          checked={filters.category === category.value}
                          onChange={() => handleFilterChange('category', category.value)}
                          className="mr-2"
                        />
                        <label htmlFor={`category-${category.value}`}>{category.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-4">
            <h2 className="text-lg font-bold mb-6">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.value} className="flex items-center">
                      <input
                        id={`desktop-category-${category.value}`}
                        type="radio"
                        name="category"
                        checked={filters.category === category.value}
                        onChange={() => handleFilterChange('category', category.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`desktop-category-${category.value}`}>{category.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  {/* Product Badges */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    {getDaysSinceRelease(product.releaseDate) < 7 && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <FiClock size={10} /> NEW
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => addToWishlist(product)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500 bg-white shadow-md'}`}
                  >
                    <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} />
                  </button>

                  {/* Product Image */}
                  <Link to={`/product/${product.id}`} className="block relative pt-[100%] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>

                    <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {product.colors.map(color => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ 
                            backgroundColor: color.toLowerCase() === 'rose gold' ? '#e0bfb8' : 
                                          color.toLowerCase() === 'black' ? '#000' : 
                                          color.toLowerCase() === 'silver' ? '#c0c0c0' : 
                                          '#3b82f6'
                          }}
                          title={color}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters</p>
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;