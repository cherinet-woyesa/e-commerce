import React, { useState } from 'react';

const TelebirrPaymentForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!phone) {
      setError('Phone number is required');
      return;
    }

    // Validate Ethiopian phone number format
    const phonePattern = /^\+?251[0-9]{9}$/;
    if (!phonePattern.test(phone)) {
      setError('Please enter a valid Ethiopian phone number (e.g., +251912345678)');
      return;
    }

    onSubmit({
      phone
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Telebirr Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            // Format phone number to include country code if not present
            const value = e.target.value;
            if (!value.startsWith('+251') && value.length > 0) {
              setPhone('+251' + value);
            } else {
              setPhone(value);
            }
          }}
          placeholder="Enter your Telebirr phone number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
      >
        Continue with Telebirr Payment
      </button>
    </form>
  );
};

export default TelebirrPaymentForm;
