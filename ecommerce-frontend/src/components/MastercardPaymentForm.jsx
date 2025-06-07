import React, { useState } from 'react';
import { FiCreditCard, FiLock } from 'react-icons/fi';

const MastercardPaymentForm = ({ onPaymentDataChange }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  const validateCard = () => {
    const newErrors = {};
    
    // Card number validation (16 digits)
    if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    // Card holder validation
    if (!cardData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }
    
    // Expiry date validation (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }
    
    // CVV validation (3-4 digits)
    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Notify parent component of changes
    onPaymentDataChange({
      ...cardData,
      [name]: formattedValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <FiLock className="text-green-500" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <FiCreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Holder Name</label>
        <input
          type="text"
          name="cardHolder"
          value={cardData.cardHolder}
          onChange={handleInputChange}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.cardHolder ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.cardHolder && (
          <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={cardData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength="5"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength="4"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.cvv ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MastercardPaymentForm; 