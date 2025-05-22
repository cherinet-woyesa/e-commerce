import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCreditCard,
  FiUser,
  FiMail,
  FiMapPin,
  FiTruck,
  FiLock,
  FiChevronLeft,
  FiCheck,
  FiShield
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StripePaymentForm from '../components/StripePaymentForm';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    country: 'United States',
    state: '',
    zip: '',
    city: '',
    shippingMethod: 'standard',
    paymentMethod: 'credit',
    saveInfo: false,
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    if (currentStep === 2) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip) newErrors.zip = 'ZIP code is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }

    if (currentStep === 3 && formData.paymentMethod === 'credit') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      if (!formData.cardExp) newErrors.cardExp = 'Expiration date is required';
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC is required';
    }

    if (currentStep === 3 && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    try {
      setLoading(true);
      
      // Handle payment for final step
      if (step === 3) {
        await handleMockPayment({
          card: {
            last4: '4242',
            brand: 'visa',
            exp_month: new Date().getMonth() + 1,
            exp_year: new Date().getFullYear() + 1
          }
        });
      } else {
        setStep(step + 1);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMockPayment = async (paymentData) => {
    try {
      setLoading(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create order in Firebase
      const orderRef = await db.collection('orders').add({
        userId: currentUser.uid,
        items: cartItems,
        total: cartTotal,
        shipping: formData.shippingMethod,
        payment: {
          method: formData.paymentMethod,
          card: paymentData.card
        },
        shippingAddress: {
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        status: 'pending',
        createdAt: new Date()
      });

      // Clear cart
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order/${orderRef.id}`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate order totals
  const shippingCost = formData.shippingMethod === 'express' ? 9.99 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingCost + tax;

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  // Render input field with error handling
  const renderInput = (name, label, type = 'text', placeholder = '', options = []) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg ${errors[name] ? 'border-red-500' : ''}`}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg ${errors[name] ? 'border-red-500' : ''}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 1: return (
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <h2 className="text-xl font-bold mt-8 mb-6">Shipping Address</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Apartment, suite, etc. (optional)</label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="saveInfo">Save this information for next time</label>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-gray-50"
                >
                  <FiChevronLeft /> Return to Cart
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 ${loading ? 'opacity-75' : ''}`}
                >
                  {loading ? 'Processing...' : 'Continue to Shipping'}
                </button>
              </div>
            </div>
          </div>
        </form>
      );

      case 2: return (
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
            
            <div className="space-y-4 mb-8">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.shippingMethod === 'standard' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'}`}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="standard"
                  checked={formData.shippingMethod === 'standard'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Standard Shipping</div>
                  <div className="text-sm text-gray-500">3-5 business days • FREE</div>
                </div>
                <div className="font-medium">$0.00</div>
              </label>
              
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.shippingMethod === 'express' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'}`}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={formData.shippingMethod === 'express'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Express Shipping</div>
                  <div className="text-sm text-gray-500">1-2 business days</div>
                </div>
                <div className="font-medium">$9.99</div>
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 ${loading ? 'opacity-75' : ''}`}
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </form>
      );

      case 3: return (
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit"
                  checked={formData.paymentMethod === 'credit'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="flex gap-2 mt-2">
                    {['visa', 'mastercard', 'amex'].map(card => (
                      <img key={card} src={`/payment-${card}.svg`} alt={card} className="h-6" />
                    ))}
                  </div>
                </div>
                <FiCreditCard className="text-gray-500" />
              </label>
            </div>

            {formData.paymentMethod === 'credit' && (
              <StripePaymentForm 
                amount={grandTotal}
                onSubmit={handleMockPayment}
              />
            )}

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-medium mb-4">Billing Address</h3>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  name="sameAsShipping"
                  checked={formData.sameAsShipping}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="sameAsShipping">Same as shipping address</label>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mr-2 mt-1"
              />
              <label htmlFor="agreeTerms" className="text-sm">
                I agree to the Terms of Service and Privacy Policy
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <FiShield className="text-green-500" />
              <span>Your transaction is secured with SSL encryption</span>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 ${loading ? 'opacity-75' : ''}`}
              >
                {loading ? 'Processing...' : (
                  <>
                    <FiLock /> Complete Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      );

      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/cart')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <FiChevronLeft className="mr-1" /> Cart
            </button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {stepNumber}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {stepNumber === 1 ? 'Information' : stepNumber === 2 ? 'Shipping' : 'Payment'}
                </span>
              </div>
            ))}
          </div>

          {renderStep()}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <FiTruck className="text-gray-400" />
              <span>
                {formData.shippingMethod === 'express' ? 
                  'Estimated delivery: 1-2 business days' : 
                  'Estimated delivery: 3-5 business days'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;