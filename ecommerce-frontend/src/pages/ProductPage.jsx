import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiStar,
  FiTruck,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  // Sample product data - in a real app this would come from an API
  const product = {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    images: [
      '/images/headphones-1.jpg',
      '/images/headphones-2.jpg',
      '/images/headphones-3.jpg'
    ],
    description: 'Industry-leading noise cancellation with 30-hour battery life',
    features: [
      'Active Noise Cancellation',
      'Touch Controls',
      '30h Playtime',
      'Built-in Mic',
      'Bluetooth 5.0'
    ],
    specifications: {
      'Weight': '250g',
      'Dimensions': '18.5 x 19.5 x 4.5 cm',
      'Battery': '30 hours',
      'Connectivity': 'Bluetooth 5.0'
    },
    rating: 4.8,
    reviews: 142,
    stock: 15,
    colors: ['Black', 'Silver', 'Blue'],
    isNew: true,
    isBestSeller: true
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddToCart = () => {
    if (!selectedColor && product.colors.length > 0) {
      alert('Please select a color');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor || 'N/A'
    }, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: selectedColor || 'N/A'
      });
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="sticky top-4">
            <div className="relative h-96 mb-4 rounded-xl overflow-hidden bg-gray-100">
              <img 
                src={product.images[activeImage]} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.stock < 20 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Only {product.stock} left!
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  NEW
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded border overflow-hidden ${activeImage === i ? 'border-blue-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-8">{product.description}</p>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-2">Color: {selectedColor || 'Select'}</h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-gray-200'}`}
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'black' ? '#000' : 
                                      color.toLowerCase() === 'silver' ? '#c0c0c0' : 
                                      '#3b82f6'
                    }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50"
              >
                <FiChevronDown />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50"
              >
                <FiChevronUp />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button 
              onClick={handleWishlistToggle}
              className={`flex-1 py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isWishlisted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FiHeart className={isWishlisted ? 'fill-current' : ''} /> 
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Delivery Info */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <FiTruck className="text-gray-500 text-xl" />
              <div>
                <h4 className="font-medium">Free Delivery</h4>
                <p className="text-sm text-gray-500">Estimated 2-4 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FiRefreshCw className="text-gray-500 text-xl" />
              <div>
                <h4 className="font-medium">Easy Returns</h4>
                <p className="text-sm text-gray-500">30-day return policy</p>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <button 
                onClick={() => toggleSection('features')}
                className="flex justify-between items-center w-full"
              >
                <h3 className="font-medium">Features</h3>
                {expandedSection === 'features' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedSection === 'features' && (
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-b border-gray-200 pb-4">
              <button 
                onClick={() => toggleSection('specifications')}
                className="flex justify-between items-center w-full"
              >
                <h3 className="font-medium">Specifications</h3>
                {expandedSection === 'specifications' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedSection === 'specifications' && (
                <div className="mt-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2">
                      <span className="text-gray-500">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p>Reviews component would go here</p>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Related products would be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;