import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiClock, FiArrowRight, FiStar } from 'react-icons/fi';
import { RiFlashlightFill } from 'react-icons/ri';
import { useCart } from '../context/CartContext';

const NewArrivalsSection = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  
  const newArrivals = [
    {
      id: 1,
      name: 'Ultra Slim Smartwatch',
      price: 249.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      rating: 4.7,
      colors: ['Black', 'Silver', 'Rose Gold'],
      releaseDate: '2023-06-15',
      isLimited: true
    },
    {
      id: 2,
      name: 'Noise Cancelling Headphones',
      price: 179.99,
      originalPrice: 229.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      rating: 4.9,
      colors: ['Black', 'Blue'],
      releaseDate: '2023-06-20',
      isBestSeller: true
    },
    {
      id: 3,
      name: 'Wireless Charging Pad',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      rating: 4.5,
      colors: ['White', 'Black'],
      releaseDate: '2023-06-10'
    },
    {
      id: 4,
      name: 'Premium Leather Wallet',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&w=800&q=80',
      category: 'Accessories',
      rating: 4.8,
      colors: ['Brown', 'Black'],
      releaseDate: '2023-06-05',
      isLimited: true
    }
  ];

  // Calculate days since release
  const getDaysSinceRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - releaseDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1,
      color: product.colors[0] // Default to first color
    });
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full bg-blue-500 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full">
              <RiFlashlightFill className="text-yellow-500 animate-pulse" />
              <span className="text-sm font-semibold">JUST RELEASED</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h2>
            <p className="text-lg text-gray-600">
              Discover our latest products fresh off the production line
            </p>
          </div>
          <Link 
            to="/new-arrivals" 
            className="inline-flex items-center gap-2 mt-6 md:mt-0 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            View All New Arrivals <FiArrowRight />
          </Link>
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
            <div 
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <FiClock size={12} /> NEW
                </span>
                {product.isLimited && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    LIMITED
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    BESTSELLER
                  </span>
                )}
              </div>
              
              {/* Quick actions */}
              <div className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                  onClick={() => handleAddToWishlist(product)}
                  className={`w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-700'}`}
                >
                  <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} />
                </button>
              </div>
              
              {/* Product image */}
              <div className="relative overflow-hidden h-80">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${hoveredProduct === product.id ? 'scale-105' : 'scale-100'}`}
                />
                
                {/* Add to cart button */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
              
              {/* Product info */}
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    Released {getDaysSinceRelease(product.releaseDate)} days ago
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                
                <p className="text-gray-500 text-sm mb-3">{product.category}</p>
                
                {/* Color options */}
                <div className="flex gap-2 mb-4">
                  {product.colors.map((color) => (
                    <div 
                      key={color}
                      className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-xs"
                      style={{ backgroundColor: color.toLowerCase() === 'rose gold' ? '#e0bfb8' : color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Discount badge */}
                  {product.originalPrice && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;