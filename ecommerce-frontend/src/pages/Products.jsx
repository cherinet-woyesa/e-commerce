import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiGrid,
  FiList,
  FiStar
} from 'react-icons/fi';
import { RiFlashlightFill } from 'react-icons/ri';
import { useCart } from '../context/CartContext';

// Sample product data
const allProducts = [
  {
    id: 1,
    name: 'Premium Smart Watch',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    rating: 4.8,
    reviews: 124,
    colors: ['Black', 'Blue', 'Red'],
    isNew: true,
    isBestSeller: true,
    tags: ['smart', 'wearable', 'tech']
  },
  // Add more products following the same structure...
  {
    id: 12,
    name: 'Wireless Earbuds Pro',
    price: 179.99,
    originalPrice: 229.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    rating: 4.7,
    reviews: 215,
    colors: ['White', 'Black'],
    isBestSeller: true,
    tags: ['audio', 'wireless']
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'home', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty & Personal Care' }
];

// Sorting options
const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low-high', name: 'Price: Low to High' },
  { id: 'price-high-low', name: 'Price: High to Low' },
  { id: 'newest', name: 'Newest' }
];

const ProductsPage = () => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(allProducts);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    colors: [],
    sort: 'featured'
  });

  // Apply filters when activeFilters or searchParams change
  useEffect(() => {
    let result = [...allProducts];
    
    // Category filter
    if (activeFilters.category !== 'all') {
      result = result.filter(p => p.category === activeFilters.category);
    }
    
    // Price range filter
    result = result.filter(p => 
      p.price >= activeFilters.priceRange[0] && 
      p.price <= activeFilters.priceRange[1]
    );
    
    // Color filter
    if (activeFilters.colors.length > 0) {
      result = result.filter(p => 
        activeFilters.colors.some(color => p.colors.includes(color)),
    );
    }
    
    // Sorting
    switch (activeFilters.sort) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        // Featured (default sorting)
        result.sort((a, b) => (b.isBestSeller - a.isBestSeller) || (b.rating - a.rating));
    }
    
    setFilteredProducts(result);
  }, [activeFilters]);

  // Update filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'featured';
    
    setActiveFilters(prev => ({
      ...prev,
      category,
      sort
    }));
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (filterType === 'category') {
      value === 'all' 
        ? newParams.delete('category') 
        : newParams.set('category', value);
    }
    if (filterType === 'sort') {
      value === 'featured' 
        ? newParams.delete('sort') 
        : newParams.set('sort', value);
    }
    setSearchParams(newParams);
  };

  const handleColorToggle = (color) => {
    setActiveFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSortChange = (sortOption) => {
    setActiveFilters(prev => ({
      ...prev,
      sort: sortOption
    }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleMobileFiltersToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const ProductCard = ({ product, viewMode }) => {
    const isWishlisted = isInWishlist(product.id);

    const handleAddToCart = (e) => {
      e.preventDefault();
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.colors[0] || 'N/A'
      });
    };

    const handleWishlistToggle = (e) => {
      e.preventDefault();
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color: product.colors[0] || 'N/A'
        });
      }
    };

    if (viewMode === 'list') {
      return (
        <div className="flex bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="w-1/3">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
            
            <h3 className="font-medium mb-2">{product.name}</h3>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiHeart className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default grid view
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiHeart className={isWishlisted ? 'fill-current' : ''} />
          </button>
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          
          <h3 className="font-medium mb-2">{product.name}</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero section for products page */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Our Products
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Discover our premium collection of carefully curated items
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar - mobile */}
          <div className="md:hidden mb-6">
            <button
              onClick={handleMobileFiltersToggle}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
            >
              <FiFilter />
              <span>Filters</span>
              {mobileFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {mobileFiltersOpen && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <FilterSidebar 
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  categories={categories}
                />
              </div>
            )}
          </div>

          {/* Filters sidebar - desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar 
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar with sorting and view options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center gap-4">
                {/* View mode toggle */}
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <FiList />
                  </button>
                </div>
                
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={activeFilters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm bg-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products grid/list */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters to find what you're looking for
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded border bg-blue-600 text-white">
                    1
                  </button>
                  <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter sidebar component
const FilterSidebar = ({ activeFilters, onFilterChange, categories }) => {
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow'];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                id={`category-${category.id}`}
                name="category"
                type="radio"
                checked={activeFilters.category === category.id}
                onChange={() => onFilterChange('category', category.id)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-3 text-sm text-gray-600"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Price range</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">$0</span>
          <span className="text-sm text-gray-500">$1000</span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          value={activeFilters.priceRange[1]}
          onChange={(e) => onFilterChange('priceRange', [0, parseInt(e.target.value)])}
          className="w-full mt-2"
        />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Colors</h3>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center">
              <input
                id={`color-${color}`}
                name="color"
                type="checkbox"
                checked={activeFilters.colors.includes(color)}
                onChange={(e) => {
                  const newColors = e.target.checked
                    ? [...activeFilters.colors, color]
                    : activeFilters.colors.filter(c => c !== color);
                  onFilterChange('colors', newColors);
                }}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`color-${color}`}
                className="ml-2 text-sm text-gray-600"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onFilterChange('category', 'all')}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Reset all filters
      </button>
    </div>
  );
};

export default ProductsPage;
