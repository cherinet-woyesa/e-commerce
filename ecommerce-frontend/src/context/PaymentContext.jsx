import React, { createContext, useContext, useState, useEffect } from 'react';
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD, PAYMENT_VALIDATION, ETHIOPIAN_BANKS } from '../config/paymentConfig';

const PaymentContext = createContext();

export function usePayment() {
  return useContext(PaymentContext);
}

export function PaymentProvider({ children }) {
  const [selectedMethod, setSelectedMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (method, data) => {
    setLoading(true);
    setError(null);
    
    try {
      switch (method) {
        case PAYMENT_METHODS.TELEBIRR.id:
          await handleTelebirrPayment(data);
          break;
        case PAYMENT_METHODS.BANK_TRANSFER.id:
          await handleBankTransfer(data);
          break;
        case PAYMENT_METHODS.CASH_ON_DELIVERY.id:
          await handleCashOnDelivery(data);
          break;
        default:
          throw new Error('Invalid payment method');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleTelebirrPayment = async (data) => {
    try {
      // Validate phone number
      if (!data.phone) {
        throw new Error('Phone number is required');
      }

      // Format phone number
      const phone = data.phone.startsWith('+251') ? data.phone : '+251' + data.phone;
      
      // Here you would typically make an API call to your backend
      // which would then communicate with Telebirr's API
      return {
        success: true,
        message: 'Telebirr payment initiated successfully. Please complete the payment in your Telebirr app.'
      };
    } catch (error) {
      throw error;
    }
  };

  const handleBankTransfer = async (data) => {
    try {
      // Generate unique reference number
      const reference = 'REF' + Date.now().toString().slice(-6);
      
      // Here you would typically store the bank transfer details in your database
      // and wait for the actual transfer to be completed
      return {
        success: true,
        reference,
        message: 'Bank transfer details have been saved. Please transfer the amount to the following account:'
      };
    } catch (error) {
      throw error;
    }
  };

  const handleCashOnDelivery = async (data) => {
    try {
      // For COD, we just need to confirm the order
      // The payment will be collected when the order is delivered
      return {
        success: true,
        message: 'Order confirmed. Payment will be collected upon delivery.'
      };
    } catch (error) {
      throw error;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        selectedMethod,
        setSelectedMethod,
        paymentData,
        setPaymentData,
        handlePayment,
        loading,
        setLoading,
        error
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export default PaymentProvider;
