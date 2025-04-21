// src/constants/bookingConstants.js
export const PAYMENT_STATUS = {
    PAID: 'Paid',
    PARTIAL: 'Partial',
    UNPAID: 'Unpaid',
    CHECKED_OUT: 'Checked Out'
  };
  
  export const STATUS_COLORS = {
    [PAYMENT_STATUS.PAID]: 'bg-green-200 hover:bg-green-300',
    [PAYMENT_STATUS.PARTIAL]: 'bg-yellow-200 hover:bg-yellow-300',
    [PAYMENT_STATUS.UNPAID]: 'bg-red-200 hover:bg-red-300',
    [PAYMENT_STATUS.CHECKED_OUT]: 'bg-gray-300 hover:bg-gray-400'
  };
  
  export const STATUS_ICONS = {
    [PAYMENT_STATUS.PAID]: '👤',
    [PAYMENT_STATUS.PARTIAL]: '👤',
    [PAYMENT_STATUS.UNPAID]: '👤',
    [PAYMENT_STATUS.CHECKED_OUT]: '👤'
  };