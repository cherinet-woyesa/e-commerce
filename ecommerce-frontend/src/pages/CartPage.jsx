import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiArrowLeft,
  FiLock
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingCost + tax - discount;

  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'SAVE10') {
        setDiscount(cartTotal * 0.1); // 10% discount
      } else {
        setDiscount(0);
        alert('Invalid coupon code');
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <FiShoppingCart className="mx-auto text-4xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
        <Link 
          to="/products"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <FiArrowLeft className="mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Your Cart ({cartCount})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={`${item.id}-${item.color}`} className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-200">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full sm:w-32 h-32 object-contain rounded-lg bg-gray-100 p-4"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-lg hover:text-blue-600">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    {item.color && item.color !== 'N/A' && (
                      <p className="text-gray-500 mb-2">Color: {item.color}</p>
                    )}
                    <p className="text-lg font-bold mb-4">${item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 h-6"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      <FiChevronDown />
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      <FiChevronUp />
                    </button>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Coupon Code */}
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-3">Apply Coupon Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 border rounded-lg"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                onClick={applyCoupon}
                disabled={isApplyingCoupon}
                className={`px-4 py-2 rounded-lg font-medium ${isApplyingCoupon ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkoutpage"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FiShoppingCart /> Proceed to Checkout
          </Link>

          <div className="flex items-center gap-2 text-sm text-gray-500 justify-center mb-6">
            <FiLock className="text-gray-400" />
            <span>Secure checkout</span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-2">Accepted Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              {['visa', 'mastercard', 'amex', 'paypal', 'applepay'].map(method => (
                <img 
                  key={method}
                  src={`/payment-${method}.svg`} 
                  alt={method}
                  className="h-8"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;