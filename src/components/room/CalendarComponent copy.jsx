// src/components/ReservationCalendar.jsx
import { useState,useEffect, useRef } from 'react';
import { gethotelrooms } from "./api";

// src/components/ReservationCalendar.jsx

const ReservationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 17));
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragRoom, setDragRoom] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await gethotelrooms();
        if (response.status === 1 && Array.isArray(response.result)) {
          const formattedRooms = response.result.map(room => ({
            id: room.roomnumber,
            price: room.pricePerNight,
          }));
          setRooms(formattedRooms);
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

  const handleMouseDown = (roomId, date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    
    setIsDragging(true);
    setDragStart(date);
    setDragRoom(roomId);
    toggleReservation(roomId, date);
  };

  const handleMouseEnter = (roomId, date) => {
    if (!isDragging || dragRoom !== roomId || date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    
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
    <div 
      className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
      ref={calendarRef}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg shadow-md text-white">
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>◀</button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>▶</button>
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
          <div className="w-32 font-semibold text-sm text-center py-2 px-3 my-2 border-r border-gray-300 bg-indigo-50 text-indigo-700">
            Rooms
          </div>

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const isToday =
              date === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();
            return (
              <div
                key={`date-${date}`}
                className={`flex-1 min-w-[45px] text-center py-2 border-r border-gray-300 ${
                  isToday ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'
                }`}
              >
                <div className="text-xs font-medium">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(year, month, date).getDay()]}
                </div>
                <div>{date}</div>
              </div>
            );
          })}
        </div>

        {/* Room Rows */}
        {rooms.map(room => (
          <div key={`room-${room.id}`} className="flex border-b border-gray-200 hover:bg-gray-50">
            <div className="w-32 px-3 py-2 border-r border-gray-300 bg-white text-center text-indigo-800 font-semibold shadow-inner">
              <div className="text-lg">{room.id}</div>
              <div className="text-xs text-gray-500">{room.price.toFixed(2)}</div>
            </div>
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const thisDate = new Date(year, month, date);
              const isSelectedDate = isSelected(room.id, thisDate);
              const isWeekend = thisDate.getDay() % 6 === 0;
              const isPast = thisDate < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <div
                  key={`slot-${room.id}-${date}`}
                  className={`flex-1 min-w-[45px] p-1 text-center text-xs border-r border-gray-200 cursor-pointer transition duration-200 ${
                    isPast
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelectedDate
                      ? 'bg-blue-200 border-blue-400 font-semibold text-blue-900'
                      : isWeekend
                      ? 'bg-orange-50 text-orange-600'
                      : 'hover:bg-blue-50'
                  }`}
                  onMouseDown={() => handleMouseDown(room.id, thisDate)}
                  onMouseEnter={() => handleMouseEnter(room.id, thisDate)}
                  onMouseUp={handleMouseUp}
                >
                  {isSelectedDate && (
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
            ✅ Selected:
            <ul className="list-disc list-inside mt-1">
              {selectedReservations.map((res, idx) => (
                <li key={idx}>
                  Room <strong>{res.roomId}</strong> on {res.date.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          '📅 Click or drag on dates to select multiple reservations.'
        )}
      </div>
    </div>
  );
};


export default ReservationCalendar;
