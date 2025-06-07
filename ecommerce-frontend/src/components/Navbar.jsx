import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaHeart,
  FaUser,
  FaChevronDown
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { 
  RiMenu2Fill, 
  RiCloseFill, 
  RiShoppingCart2Fill, 
  RiUser3Fill, 
  RiUserLine, 
  RiLogoutBoxLine,
  RiFlashlightFill
} from 'react-icons/ri';
import WishlistDropdown from './WishlistDropdown';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { cartItems, wishlistCount } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const categories = [
    { name: 'Home', path: '/' },
    { name: 'New Arrivals', path: '/new-arrivals', icon: <RiFlashlightFill className="text-yellow-400 mr-1" /> },
    { 
      name: 'Categories', 
      path: '/categories',
      submenu: [
        { name: 'Electronics', path: '/category/electronics' },
        { name: 'Fashion', path: '/category/fashion' },
        { name: 'Home & Living', path: '/category/home' },
        { name: 'Books', path: '/category/books' }
      ]
    },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm py-2 px-4 text-center">
        Free shipping on orders over $50 | Use code <span className="font-bold">NEW10</span> for 10% off
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              chereto
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="relative group"
                onMouseEnter={() => setIsHovering(category.name)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <Link
                  to={category.path}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 transition duration-200 font-medium text-sm uppercase tracking-wider"
                >
                  {category.icon && category.icon}
                  {category.name}
                  {category.submenu && <FaChevronDown className="ml-1 text-xs opacity-70" />}
                </Link>

                {/* Submenu Dropdown */}
                {category.submenu && isHovering === category.name && (
                  <div className="absolute left-0 mt-0 w-56 bg-white shadow-lg rounded-md py-1 z-10 border border-gray-100">
                    {category.submenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                className="p-2 text-gray-600 hover:text-purple-600 relative"
              >
                <FaHeart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <WishlistDropdown 
                isOpen={isWishlistOpen} 
                onClose={() => setIsWishlistOpen(false)} 
              />
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsWishlistOpen(false);
                }}
                className="p-2 text-gray-600 hover:text-purple-600 relative"
              >
                <IoMdNotificationsOutline className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>

            <Link to="/cart" className="p-2 text-gray-600 hover:text-purple-600 relative">
              <FaShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={handleProfileClick} 
                  className="flex items-center space-x-2"
                >
                  <RiUser3Fill className="text-2xl" />
                  <span>Profile</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                      onClick={handleProfileClick}
                    >
                      <div className="flex items-center space-x-2">
                        <RiUserLine className="text-gray-400" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <RiLogoutBoxLine className="text-gray-400" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-2">
                  <RiUser3Fill className="text-2xl" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2">
                  <RiUser3Fill className="text-2xl" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/cart" className="flex items-center space-x-2">
              <RiShoppingCart2Fill className="text-2xl" />
              <span className="relative -top-1">
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </span>
            </Link>
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={handleProfileClick} 
                  className="flex items-center space-x-2"
                >
                  <RiUser3Fill className="text-2xl" />
                  <span>Profile</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                      onClick={handleProfileClick}
                    >
                      <div className="flex items-center space-x-2">
                        <RiUserLine className="text-gray-400" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <RiLogoutBoxLine className="text-gray-400" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-2">
                  <RiUser3Fill className="text-2xl" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2">
                  <RiUser3Fill className="text-2xl" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-purple-600 transition duration-200"
            >
              {isMobileMenuOpen ? <RiCloseFill className="text-2xl" /> : <RiMenu2Fill className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative px-3 mb-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <FaSearch className="absolute left-6 top-3 text-gray-400" />
              </div>

              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    to={category.path}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {category.icon && category.icon}
                        {category.name}
                        {category.badge && (
                          <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {category.badge}
                          </span>
                        )}
                      </div>
                      {category.submenu && <FaChevronDown className="text-xs opacity-70" />}
                    </div>
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {category.submenu && (
                    <div className="pl-6">
                      {category.submenu.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-gray-100 pt-2">
                <Link
                  to="/wishlist"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaHeart className="mr-3" />
                  Wishlist
                  <span className="ml-auto bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="mr-3" />
                  My Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;