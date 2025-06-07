import React from 'react';
import { FiCreditCard, FiPhone, FiBank, FiMoney } from 'react-icons/fi';
import { FaPaypal } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../config/paymentConfig';

const PaymentMethod = ({ selectedMethod, onSelect }) => {
  const methods = Object.values(PAYMENT_METHODS).map(method => ({
    id: method.id,
    name: method.label,
    icon: method.icon,
    cards: method.id === 'stripe' ? ['visa', 'mastercard', 'amex'] : []
  }));

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'fi-credit-card':
        return FiCreditCard;
      case 'fi-phone':
        return FiPhone;
      case 'fi-bank':
        return FiBank;
      case 'fi-money':
        return FiMoney;
      case 'fi-paypal':
        return FaPaypal;
      default:
        return FiCreditCard;
    }
  };

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedMethod === method.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={selectedMethod === method.id}
            onChange={() => onSelect(method.id)}
            className="mr-4"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              {method.name}
            </div>
            {method.cards.length > 0 && (
              <div className="flex gap-2 mt-2">
                {method.cards.map((card) => (
                  <img
                    key={card}
                    src={`/payment-${card}.svg`}
                    alt={card}
                    className="h-6"
                  />
                ))}
              </div>
            )}
          </div>
            onChange={() => onSelect(method.id)}
            className="mr-4"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              {method.name}
            </div>
            {method.cards.length > 0 && (
              <div className="flex gap-2 mt-2">
                {method.cards.map((card) => (
                  <img
                    key={card}
                    src={`/payment-${card}.svg`}
                    alt={card}
                    className="h-6"
                  />
                ))}
              </div>
            )}
          </div>
          <method.icon className="w-5 h-5 text-gray-500" />
        </label>
      ))}
    </div>
  );
};

export default PaymentMethod;
