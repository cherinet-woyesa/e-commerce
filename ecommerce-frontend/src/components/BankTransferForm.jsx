import React, { useState } from 'react';
import { ETHIOPIAN_BANKS } from '../config/paymentConfig';

const BankTransferForm = ({ onSubmit }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate bank name and account number
    if (!bankName) {
      setError('Bank name is required');
      return;
    }

    if (!accountNumber) {
      setError('Account number is required');
      return;
    }

    // Validate account number format
    const accountPattern = /^[0-9]{12,16}$/;
    if (!accountPattern.test(accountNumber)) {
      setError('Please enter a valid account number (12-16 digits)');
      return;
    }

    onSubmit({
      bank_name: bankName,
      account_number: accountNumber
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bank</label>
        <select
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select your bank</option>
          {ETHIOPIAN_BANKS.map((bank) => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Account Number</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter your bank account number"
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
        Continue with Bank Transfer
      </button>
    </form>
  );
};

export default BankTransferForm;
