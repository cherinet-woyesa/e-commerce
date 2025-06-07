import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser,
  FiMail,
  FiMapPin,
  FiTruck,
  FiLock,
  FiChevronLeft,
  FiCheck,
  FiShield,
  FiPhone,
  FiCreditCard,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import TelebirrPaymentForm from '../components/TelebirrPaymentForm';
import BankTransferForm from '../components/BankTransferForm';
import MastercardPaymentForm from '../components/MastercardPaymentForm';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { handlePayment, error, loading, setLoading } = usePayment();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'Ethiopia',
    shippingMethod: 'standard',
    saveInfo: false,
    agreeTerms: false,
    paymentData: {
      phone: '',
      bank_name: '',
      account_number: ''
    },
    telebirrNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

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

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Contact Information
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Invalid phone number format';
    }
        break;

      case 1: // Shipping Information
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State/Province is required';
        if (!formData.zip) newErrors.zip = 'ZIP/Postal code is required';
      if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.shippingMethod) newErrors.shippingMethod = 'Please select a shipping method';
        break;

      case 2: // Payment Method
        if (!selectedMethod) newErrors.paymentMethod = 'Please select a payment method';
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
          break;

      default:
          break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submission logic for step 3 (Review)
    try {
      setIsProcessing(true);
      setFormError('');

      // Handle payment for final step
      if (step === 3) {
        // Create order in Firebase first
        const orderRef = await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        items: cartItems,
        total: cartTotal,
        shipping: formData.shippingMethod,
        payment: {
            method: selectedMethod,
            status: 'pending',
            details: formData.paymentData
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
          createdAt: serverTimestamp()
        });

        // Process payment based on method
        let paymentResult;
        switch (selectedMethod) {
          case 'telebirr':
            paymentResult = await processTelebirrPayment({
              amount: cartTotal,
              phoneNumber: formData.telebirrNumber
            });
            break;

          case 'bank_transfer':
            paymentResult = await processBankTransfer({
              ...formData.paymentData,
              orderId: orderRef.id,
              amount: cartTotal
            });
            break;

          case 'mastercard':
            paymentResult = await processMastercardPayment({
              ...formData.paymentData,
              orderId: orderRef.id,
              amount: cartTotal
            });
            break;

          default:
            throw new Error('Invalid payment method');
        }

        // Verify payment status
        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment failed');
        }

        // Update order status
        await updateDoc(orderRef, {
          'payment.status': 'completed',
          'payment.transactionId': paymentResult.transactionId,
          status: 'processing'
        });

        // Clear cart after successful payment
      clearCart();
      
      // Navigate to order confirmation
        navigate('/order-confirmation', { 
          state: { 
            orderId: orderRef.id,
            total: cartTotal,
            paymentMethod: selectedMethod,
            transactionId: paymentResult.transactionId
          }
        });
      } else {
        setStep(step + 1);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setFormError(err.message || 'Payment failed. Please try again.');
      
      // Navigate to error page if payment fails
      if (step === 3) {
        navigate('/payment-error', { 
          state: { 
            error: err.message,
            returnTo: '/checkout'
          }
        });
      }
    } finally {
      setIsProcessing(false);
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <FiAlertCircle className="mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 0: // Contact Information
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            {renderInput('email', 'Email', 'email', 'your@email.com')}
            {renderInput('firstName', 'First Name')}
            {renderInput('lastName', 'Last Name')}
            {renderInput('phone', 'Phone Number', 'tel', '+251 9XXXXXXXX')}
          </div>
        );

      case 1: // Shipping Information
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            {renderInput('address', 'Address')}
            {renderInput('apartment', 'Apartment, suite, etc. (optional)')}
            {renderInput('city', 'City')}
            {renderInput('state', 'State/Province')}
            {renderInput('zip', 'ZIP/Postal Code')}
            {renderInput('country', 'Country', 'select', '', ['Ethiopia', 'Kenya', 'Uganda', 'Tanzania'])}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  formData.shippingMethod === 'standard' ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-500'
                }`}>
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
                    <div className="text-sm text-gray-600">5-7 business days</div>
                </div>
                  <span className="font-medium">Free</span>
              </label>
              
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  formData.shippingMethod === 'express' ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-500'
                }`}>
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
                    <div className="text-sm text-gray-600">2-3 business days</div>
                </div>
                  <span className="font-medium">$9.99</span>
              </label>
              </div>
              {errors.shippingMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingMethod}</p>
              )}
            </div>
          </div>
        );

      case 2: // Payment Method
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSelectedMethod('telebirr')}
                className={`p-4 border rounded-lg text-center ${
                  selectedMethod === 'telebirr'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-500'
                }`}
              >
                <img src="/telebirr-logo.png" alt="Telebirr" className="h-8 mx-auto mb-2" />
                <span className="block text-sm font-medium">Telebirr</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedMethod('bank_transfer')}
                className={`p-4 border rounded-lg text-center ${
                  selectedMethod === 'bank_transfer'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-500'
                }`}
              >
                <img src="/bank-transfer.png" alt="Bank Transfer" className="h-8 mx-auto mb-2" />
                <span className="block text-sm font-medium">Bank Transfer</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedMethod('mastercard')}
                className={`p-4 border rounded-lg text-center ${
                  selectedMethod === 'mastercard'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-500'
                }`}
              >
                <img src="/mastercard-logo.png" alt="Mastercard" className="h-8 mx-auto mb-2" />
                <span className="block text-sm font-medium">Mastercard</span>
              </button>
            </div>

            {renderPaymentMethod()}
            
            <div className="mt-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-600">
                  I agree to the terms and conditions and privacy policy
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
              )}
            </div>
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p>{formData.email}</p>
              <p>{formData.firstName} {formData.lastName}</p>
              <p>{formData.phone}</p>
                </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p>{formData.address}</p>
              {formData.apartment && <p>{formData.apartment}</p>}
              <p>{formData.city}, {formData.state} {formData.zip}</p>
              <p>{formData.country}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="capitalize">{selectedMethod.replace('_', ' ')}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'telebirr':
        return showVerification ? (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <FiInfo className="text-lg" />
                <span className="font-medium">Check your phone</span>
              </div>
              <p className="text-sm text-purple-600">
                We've sent a verification code to your Telebirr number. Please enter it below to complete your payment.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                maxLength={6}
              />
              {errors.verificationCode && (
                <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Change number
              </button>
            </div>

              <button
                type="submit"
              disabled={isProcessing}
              className={`w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 ${
                isProcessing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify Payment'
                )}
              </button>
          </form>
        ) : (
          <form onSubmit={handleTelebirrSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telebirr Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+251</span>
                <input
                  type="tel"
                  name="telebirrNumber"
                  value={formData.telebirrNumber}
                  onChange={handleInputChange}
                  placeholder="9XXXXXXXX"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              {errors.telebirrNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.telebirrNumber}</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Amount to pay:</span>
                <span className="font-semibold">ETB {grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">
                You will receive a verification code on your Telebirr number to complete the payment.
              </p>
          </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 ${
                isProcessing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Continue to Payment'
              )}
            </button>
        </form>
      );

      case 'bank_transfer':
        return (
          <BankTransferForm
            onPaymentDataChange={(data) => setFormData(prev => ({
              ...prev,
              paymentData: data
            }))}
          />
        );
      case 'mastercard':
        return (
          <MastercardPaymentForm
            onPaymentDataChange={(data) => setFormData(prev => ({
              ...prev,
              paymentData: data
            }))}
          />
        );
      default:
        return null;
    }
  };

  // Payment processing functions
  const processTelebirrPayment = async ({ amount, phoneNumber }) => {
    // Simulate API call to Telebirr
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId: `TEL-${Date.now()}`,
          status: 'pending',
          message: 'Verification code sent'
        });
      }, 1500);
    });
  };

  const verifyTelebirrPayment = async ({ transactionId, verificationCode }) => {
    // Simulate API call to verify payment
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, any 6-digit code will work
        resolve(verificationCode.length === 6);
      }, 1500);
    });
  };

  const processBankTransfer = async (paymentData) => {
    try {
      // Simulate bank transfer verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Generate bank transfer details
      // 2. Send confirmation email with transfer details
      // 3. Wait for bank confirmation
      // 4. Update order status when confirmed
      
      return {
        success: true,
        transactionId: `BANK-${Date.now()}`,
        transferDetails: {
          bankName: paymentData.bank_name,
          accountNumber: paymentData.account_number,
          reference: `ORDER-${paymentData.orderId}`
        }
      };
    } catch (error) {
      console.error('Bank transfer error:', error);
      return {
        success: false,
        error: 'Bank transfer failed. Please try again.'
      };
    }
  };

  const processMastercardPayment = async (paymentData) => {
    try {
      // Simulate Mastercard payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Call payment gateway API (e.g., Stripe)
      // 2. Process the card payment
      // 3. Get transaction confirmation
      
      return {
        success: true,
        transactionId: `MC-${Date.now()}`,
        last4: paymentData.cardNumber.slice(-4)
      };
    } catch (error) {
      console.error('Mastercard payment error:', error);
      return {
        success: false,
        error: 'Card payment failed. Please try again.'
      };
    }
  };

  const handleTelebirrSubmit = async (e) => {
    e.preventDefault();
    if (!formData.telebirrNumber) {
      setErrors(prev => ({ ...prev, telebirrNumber: 'Please enter your Telebirr number' }));
      return;
    }

    try {
      setIsProcessing(true);
      // Simulate API call to initiate payment
      const response = await processTelebirrPayment({
        amount: grandTotal,
        phoneNumber: formData.telebirrNumber
      });

      setPaymentDetails(response);
      setShowVerification(true);
      setErrors({});
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: 'Please enter the verification code' }));
      return;
    }

    try {
      setIsProcessing(true);
      // Verify the payment
      const isVerified = await verifyTelebirrPayment({
        transactionId: paymentDetails.transactionId,
        verificationCode
      });

      if (isVerified) {
        // Create order in Firebase
        const orderRef = await addDoc(collection(db, 'orders'), {
          userId: currentUser.uid,
          items: cartItems,
          total: grandTotal,
          status: 'paid',
          paymentMethod: 'telebirr',
          paymentDetails: {
            transactionId: paymentDetails.transactionId,
            phoneNumber: formData.telebirrNumber
          },
          shippingAddress: {
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          },
          contactInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          },
          createdAt: serverTimestamp()
        });

        // Clear cart
        clearCart();
        
        // Navigate to success page
        navigate(`/order-confirmation/${orderRef.id}`);
      } else {
        setFormError('Payment verification failed. Please try again.');
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Contact', 'Shipping', 'Payment', 'Review'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= index ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}>
                    {step > index ? <FiCheck /> : index + 1}
                  </div>
                  <span className={`ml-2 ${step >= index ? 'text-purple-600' : 'text-gray-500'}`}>
                    {label}
                  </span>
                  {index < 3 && (
                    <div className={`w-24 h-1 mx-4 ${
                      step > index ? 'bg-purple-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
              </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            {formError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                <FiAlertCircle className="mr-2" />
                {formError}
              </div>
            )}

          {renderStep()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center text-gray-600 hover:text-purple-600"
                  disabled={isProcessing}
                >
                  <FiChevronLeft className="mr-1" />
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isProcessing}
                className={`ml-auto px-6 py-2 rounded-lg text-white ${
                  isProcessing
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : step === 3 ? (
                  'Complete Order'
                ) : (
                  'Continue'
                )}
              </button>
        </div>
          </form>

        {/* Order Summary */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              <div className="flex justify-between">
                  <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
                </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;