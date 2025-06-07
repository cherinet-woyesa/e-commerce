// Payment configuration for Ethiopia e-commerce
export const PAYMENT_METHODS = {
  TELEBIRR: {
    id: 'telebirr',
    label: 'Telebirr Payment',
    icon: 'fi-phone',
    description: 'Pay using your Telebirr mobile money account'
  },
  BANK_TRANSFER: {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: 'fi-bank',
    description: 'Transfer money directly from your bank account'
  },
  CASH_ON_DELIVERY: {
    id: 'cash_on_delivery',
    label: 'Cash on Delivery',
    icon: 'fi-money',
    description: 'Pay with cash when your order arrives'
  }
};

export const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS.TELEBIRR;

// Payment method validation rules
export const PAYMENT_VALIDATION = {
  telebirr: {
    phone: {
      required: true,
      pattern: /^\+?251[0-9]{9}$/, // Ethiopian phone number pattern
      message: 'Please enter a valid Ethiopian phone number'
    }
  },
  bank_transfer: {
    bank_name: {
      required: true,
      message: 'Please select your bank'
    },
    account_number: {
      required: true,
      pattern: /^[0-9]{12,16}$/, // Bank account number pattern
      message: 'Please enter a valid bank account number'
    }
  }
};

// Ethiopian banks list
export const ETHIOPIAN_BANKS = [
  'Commercial Bank of Ethiopia',
  'Dashen Bank',
  'Awash Bank',
  'Unity Bank',
  'Nebu Bank',
  'Amhara Bank',
  'Oromia International Bank'
];
