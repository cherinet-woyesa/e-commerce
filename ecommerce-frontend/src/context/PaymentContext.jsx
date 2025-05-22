import React, { createContext, useContext } from 'react';
import stripePromise from '../config/stripe';

const PaymentContext = createContext();

export function usePayment() {
  return useContext(PaymentContext);
}

export function PaymentProvider({ children }) {
  return (
    <PaymentContext.Provider value={{ stripePromise }}>
      {children}
    </PaymentContext.Provider>
  );
}
