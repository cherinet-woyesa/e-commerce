import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ amount, onSubmit }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardElement, setCardElement] = useState(null);

  useEffect(() => {
    const stripe = stripePromise.then(stripe => {
      const elements = stripe.elements();
      const card = elements.create('card');
      card.mount('#card-element');
      setCardElement(card);

      card.on('change', ({ error }) => {
        setError(error ? error.message : '');
      });

      return () => {
        card.unmount();
      };
    });

    return () => {
      stripe.then(stripe => {
        if (cardElement) {
          cardElement.unmount();
        }
      });
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      const { token } = await stripe.createToken(cardElement);

      if (token) {
        onSubmit({
          id: token.id,
          card: {
            last4: token.card.last4,
            brand: token.card.brand,
            exp_month: token.card.exp_month,
            exp_year: token.card.exp_year
          }
        });
      }
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
