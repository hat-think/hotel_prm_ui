// src/components/ReservationCalendar.jsx
import { useState, useEffect, useRef } from 'react';
import { gethotelrooms } from "../room/api";

const ReservationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragRoom, setDragRoom] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const calendarRef = useRef(null);

  // Payment status constants
  const PAYMENT_STATUS = {
    PAID: 'Paid',
    PARTIAL: 'Partial',
    UNPAID: 'Unpaid',
    CHECKED_OUT: 'Checked Out'
  };

  const STATUS_COLORS = {
    [PAYMENT_STATUS.PAID]: 'bg-green-200 hover:bg-green-300',
    [PAYMENT_STATUS.PARTIAL]: 'bg-yellow-200 hover:bg-yellow-300',
    [PAYMENT_STATUS.UNPAID]: 'bg-red-200 hover:bg-red-300',
    [PAYMENT_STATUS.CHECKED_OUT]: 'bg-gray-300 hover:bg-gray-400'
  };

  const STATUS_ICONS = {
    [PAYMENT_STATUS.PAID]: '👤',
    [PAYMENT_STATUS.PARTIAL]: '👤',
    [PAYMENT_STATUS.UNPAID]: '👤',
    [PAYMENT_STATUS.CHECKED_OUT]: '👤'
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await gethotelrooms();
        if (response.status === 1 && Array.isArray(response.result)) {
          const formattedRooms = response.result.map(room => ({
            id: room.roomnumber,
            price: room.pricePerNight,
            type: room.roomType || 'Standard'
          }));
          setRooms(formattedRooms);
          
          // Process bookings from totalVisitors
          if (Array.isArray(response.totalVisitors)) {
            const processedBookings = response.totalVisitors.flatMap(visitor => {
              const checkIn = new Date(visitor.checkIn);
              const checkOut = new Date(visitor.checkOut);
              const dates = [];
              
              // Generate all dates between checkIn and checkOut (inclusive)
              const currentDate = new Date(checkIn);
              while (currentDate <= checkOut) {
                dates.push({
                  roomId: visitor.roomnumber,
                  date: new Date(currentDate),
                  status: visitor.status, // 1 for active, 2 for checked out
                  paymentStatus: visitor.paymentStatus || PAYMENT_STATUS.UNPAID,
                  guestName: visitor.guests[0].name,
                  bookingId: visitor.bookingId,
                  guestEmail: visitor.guestEmail,
                  guestPhone: visitor.guestPhone,
                  totalAmount: visitor.totalAmount,
                  amountPaid: visitor.amountPaid,
                  checkInDate: new Date(visitor.checkIn),
                  checkOutDate: new Date(visitor.checkOut),
                  bookingNotes: visitor.bookingNotes || '',
                  // Add any other guest details you have
                });
                currentDate.setDate(currentDate.getDate() + 1);
              }
              
              return dates;
            });
            setBookings(processedBookings);
          }
        } else {
          console.error("Failed to load rooms:", response);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const toggleReservation = (roomId, date) => {
    const exists = selectedReservations.some(
      (res) =>
        res.roomId === roomId &&
        res.date.toDateString() === date.toDateString()
    );

    if (exists) {
      setSelectedReservations((prev) =>
        prev.filter(
          (res) =>
            !(
              res.roomId === roomId &&
              res.date.toDateString() === date.toDateString()
            )
        )
      );
    } else {
      setSelectedReservations((prev) => [...prev, { roomId, date }]);
    }
  };

  const isSelected = (roomId, date) =>
    selectedReservations.some(
      (res) =>
        res.roomId === roomId &&
        res.date.toDateString() === date.toDateString()
    );

  const isBooked = (roomId, date) => {
    return bookings.some(
      (booking) =>
        booking.roomId === roomId &&
        booking.date.toDateString() === date.toDateString()
    );
  };

  const getBookingInfo = (roomId, date) => {
    return bookings.find(
      (b) => b.roomId === roomId && b.date.toDateString() === date.toDateString()
    );
  };

  const handleMouseDown = (roomId, date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    if (isBooked(roomId, date)) return;
    
    setIsDragging(true);
    setDragStart(date);
    setDragRoom(roomId);
    toggleReservation(roomId, date);
  };

  const handleMouseEnter = (roomId, date) => {
    if (!isDragging || dragRoom !== roomId || date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    if (isBooked(roomId, date)) return;
    
    let startDate = new Date(dragStart);
    let endDate = new Date(date);
    
    // Swap if end is before start
    if (endDate < startDate) {
      [startDate, endDate] = [endDate, startDate];
    }
    
    const newReservations = selectedReservations.filter(
      res => res.roomId !== roomId || res.date < startDate || res.date > endDate
    );
    
    // Add all dates in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
        newReservations.push({ roomId, date: new Date(currentDate) });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedReservations(newReservations);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setDragRoom(null);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowProfileModal(true);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
        setDragRoom(null);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const daysInMonth = getDaysInMonth();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return (
    <div className="relative">
      <div 
        className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
        ref={calendarRef}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg shadow-md text-white">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="hover:bg-indigo-600 p-1 rounded"
            >
              ◀
            </button>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="hover:bg-indigo-600 p-1 rounded"
            >
              ▶
            </button>
          </div>
          <button
            className="px-4 py-1 bg-white text-indigo-600 font-medium rounded-md text-sm shadow hover:bg-gray-100"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="flex border-b border-gray-300 bg-gray-100">
            <div className="w-40 font-semibold text-sm text-center py-2 px-3 my-2 border-r border-gray-300 bg-indigo-50 text-indigo-700">
              Rooms / Price
            </div>

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const isToday =
                date === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();
              const dayOfWeek = new Date(year, month, date).getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              
              return (
                <div
                  key={`date-${date}`}
                  className={`flex-1 min-w-[45px] text-center py-2 border-r border-gray-300 ${
                    isToday ? 'bg-blue-100 text-blue-700 font-bold' : 
                    isWeekend ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]}
                  </div>
                  <div>{date}</div>
                </div>
              );
            })}
          </div>

          {/* Room Rows */}
          {rooms.map(room => (
            <div key={`room-${room.id}`} className="flex border-b border-gray-200 hover:bg-gray-50">
              <div className="w-40 px-3 py-2 border-r border-gray-300 bg-white text-center text-indigo-800 font-semibold shadow-inner">
                <div className="text-lg">{room.id}</div>
                <div className="text-xs text-gray-500">${room.price.toFixed(2)}</div>
                <div className="text-xs text-gray-400">{room.type}</div>
              </div>
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = i + 1;
                const thisDate = new Date(year, month, date);
                const isSelectedDate = isSelected(room.id, thisDate);
                const isBookedDate = isBooked(room.id, thisDate);
                const bookingInfo = getBookingInfo(room.id, thisDate);
                const isWeekend = thisDate.getDay() % 6 === 0;
                const isPast = thisDate < new Date(new Date().setHours(0, 0, 0, 0));

                let statusColor = '';
                let statusIcon = '';
                let tooltipText = '';
                
                if (bookingInfo) {
                  const paymentStatus = bookingInfo.status === 2 ? 
                    PAYMENT_STATUS.CHECKED_OUT : 
                    bookingInfo.paymentStatus;
                  
                  statusColor = STATUS_COLORS[paymentStatus];
                  statusIcon = STATUS_ICONS[paymentStatus];
                  tooltipText = `${bookingInfo.guestName || 'Guest'} - ${paymentStatus}`;
                }

                return (
                  <div
                    key={`slot-${room.id}-${date}`}
                    className={`relative flex-1 min-w-[45px] p-1 text-center text-xs border-r border-gray-200 ${
                      isBookedDate
                        ? `${statusColor} cursor-pointer`
                        : isPast
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelectedDate
                        ? 'bg-blue-200 border-blue-400 font-semibold text-blue-900 cursor-pointer'
                        : isWeekend
                        ? 'bg-orange-50 text-orange-600 cursor-pointer'
                        : 'hover:bg-blue-50 cursor-pointer'
                    }`}
                    onMouseDown={() => handleMouseDown(room.id, thisDate)}
                    onMouseEnter={() => handleMouseEnter(room.id, thisDate)}
                    onMouseUp={handleMouseUp}
                    onClick={() => isBookedDate && bookingInfo && handleBookingClick(bookingInfo)}
                  >
                    {isBookedDate ? (
                      <>
                        <div className="font-bold">{statusIcon}</div>
                        {tooltipText && (
                          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs p-1 rounded mt-1 whitespace-nowrap">
                            {tooltipText}
                          </div>
                        )}
                      </>
                    ) : isSelectedDate && (
                      <div className="h-2 w-2 mx-auto bg-blue-600 rounded-full mt-1"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-300 font-medium">
          {selectedReservations.length > 0 ? (
            <div className="text-indigo-700">
              <div className="flex justify-between items-center">
                <span>✅ Selected {selectedReservations.length} dates</span>
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  onClick={() => {
                    console.log('Selected reservations:', selectedReservations);
                    // Here you would typically open a booking modal
                  }}
                >
                  Book Selected
                </button>
              </div>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-1 mt-2">
                {selectedReservations.map((res, idx) => (
                  <li key={idx} className="text-xs">
                    Room <strong>{res.roomId}</strong> on {res.date.toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p>📅 Click or drag on dates to select multiple reservations.</p>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Object.entries(PAYMENT_STATUS).map(([key, status]) => (
                  <div key={key} className="flex items-center">
                    <div className={`w-4 h-4 ${STATUS_COLORS[status].split(' ')[0]} mr-2 rounded-sm`}></div>
                    <span>{status} Booking</span>
                  </div>
                ))}
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-200 mr-2 rounded-sm"></div>
                  <span>Selected Dates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-50 mr-2 rounded-sm border border-orange-200"></div>
                  <span>Weekend</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guest Profile Modal */}
      {showProfileModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">Guest Details</h3>
                <button 
                  onClick={() => setShowProfileModal(false)}
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
                    <h4 className="font-bold text-lg">{selectedBooking.guestName || 'Guest'}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedBooking.paymentStatus === PAYMENT_STATUS.CHECKED_OUT ? 
                        'Checked Out' : 
                        `Status: ${selectedBooking.paymentStatus}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium">{selectedBooking.roomId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-In</p>
                    <p className="font-medium">
                      {selectedBooking.checkInDate?.toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-Out</p>
                    <p className="font-medium">
                      {selectedBooking.checkOutDate?.toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <div className="mt-2 space-y-2">
                    <p className="font-medium">{selectedBooking.guestEmail || 'No email provided'}</p>
                    <p className="font-medium">{selectedBooking.guestPhone || 'No phone provided'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Payment Details</p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">Total Amount</p>
                      <p className="font-bold">${selectedBooking.totalAmount?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-sm">Amount Paid</p>
                      <p className="font-bold">${selectedBooking.amountPaid?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.bookingNotes && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      {selectedBooking.bookingNotes}
                    </p>
                  </div>
                )}

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Here you would typically handle actions like editing the booking
                      console.log('Edit booking:', selectedBooking);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Edit Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;