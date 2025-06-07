import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const WishlistDropdown = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Wishlist</h3>
          <span className="text-sm text-gray-500">{wishlist.length} items</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-8">
            <FiHeart className="mx-auto text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {wishlist.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Add to Cart"
                  >
                    <FiShoppingCart />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/wishlist"
              className="block w-full py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={onClose}
            >
              View Wishlist
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistDropdown; 