import React, { useState, useEffect } from 'react';

const StripePaymentForm = ({ amount, onSubmit }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const form = document.querySelector('.mock-card-form');
    if (form) {
      form.addEventListener('submit', handleMockSubmit);
      return () => form.removeEventListener('submit', handleMockSubmit);
    }
  }, []);

  const handleMockSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.target.closest('.mock-card-form');
    const cardNumber = form.querySelector('input[placeholder="4242 4242 4242 4242"]');
    const expiration = form.querySelector('input[placeholder="MM/YY"]');
    const cvc = form.querySelector('input[placeholder="CVC"]');

    setLoading(true);
    setError(null);

    try {
      // Validate mock card data
      if (!cardNumber.value || !expiration.value || !cvc.value) {
        throw new Error('Please fill in all fields');
      }

      // Simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit({
        id: 'mock_payment_' + Date.now(),
        card: {
          last4: cardNumber.value.slice(-4),
          brand: 'visa',
          exp_month: parseInt(expiration.value.split('/')[0]),
          exp_year: parseInt(expiration.value.split('/')[1])
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mock-card-form space-y-4">
        <div className="mock-card-field">
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <input 
            type="text" 
            placeholder="4242 4242 4242 4242" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="mock-card-field">
          <label className="block text-sm font-medium text-gray-700">Expiration</label>
          <input 
            type="text" 
            placeholder="MM/YY" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="mock-card-field">
          <label className="block text-sm font-medium text-gray-700">CVC</label>
          <input 
            type="text" 
            placeholder="CVC" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Pay ${amount / 100} USD`
        )}
      </button>
    </div>
  );
};

export default StripePaymentForm;
