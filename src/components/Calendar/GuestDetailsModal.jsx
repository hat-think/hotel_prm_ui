// src/components/GuestDetailsModal.jsx
import { PAYMENT_STATUS } from "./bookingConstants";

const GuestDetailsModal = ({ booking, onClose, onEdit }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">Guest Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-lg">{booking.guestName || 'Guest'}</h4>
                <p className="text-sm text-gray-600">
                  {booking.paymentStatus === PAYMENT_STATUS.CHECKED_OUT ? 
                    'Checked Out' : 
                    `Status: ${booking.paymentStatus}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Room Number</p>
                <p className="font-medium">{booking.roomId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-medium">{booking.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-In</p>
                <p className="font-medium">
                  {booking.checkInDate?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-Out</p>
                <p className="font-medium">
                  {booking.checkOutDate?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Contact Information</p>
              <div className="mt-2 space-y-2">
                <p className="font-medium">{booking.guestEmail || 'No email provided'}</p>
                <p className="font-medium">{booking.guestPhone || 'No phone provided'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Payment Details</p>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Total Amount</p>
                  <p className="font-bold">${booking.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm">Amount Paid</p>
                  <p className="font-bold">${booking.amountPaid?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            {booking.bookingNotes && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="mt-2 text-sm bg-gray-50 p-2 rounded">
                  {booking.bookingNotes}
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsModal;