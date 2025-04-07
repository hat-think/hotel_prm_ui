import React, { useEffect, useState } from 'react';
import { gethotelrooms } from '../auth/api';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await gethotelrooms();
        
        if (res && res.result) {
          setRooms(res.result);
        } else {
          console.error("Invalid response:", res);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Room Details</h1>

      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-6 bg-white px-4 py-3 text-sm font-semibold text-gray-700 rounded-t-2xl border">
  <div>#</div>
  <div>Room No.</div>
  <div>Type</div>
  <div>Price/Night</div>
  <div>Occupancy</div>
  <div>Status</div>
</div>


      {/* Room Cards */}
      {rooms.map((room, index) => (
  <div
    key={room._id}
    className="bg-white p-4 border-b md:border-t-0 md:border-b md:grid md:grid-cols-6 grid-cols-1 rounded-xl md:rounded-none shadow-sm md:shadow-none mb-4 md:mb-0"
  >
    {/* ✅ Mobile View */}
    <div className="md:hidden space-y-2 text-sm">
      <div className="flex justify-between flex-wrap gap-2">
        <span className="text-gray-600 font-medium">{index + 1}</span>
        <span className="text-gray-600 font-medium">Room No: {room.roomnumber}</span>
        <span className="text-gray-600 font-medium">Type: {room.roomType}</span>
        <span className={room.available ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
          {room.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div className="flex justify-between flex-wrap gap-2">
        <span className="text-gray-600">Price: ₹{room.pricePerNight.toLocaleString()}</span>
        <span className="text-gray-600">Occupancy: {room.maxOccupancy} persons</span>
      </div>
    </div>

    {/* ✅ Desktop View */}
    <div className="hidden md:block font-semibold">{index + 1}</div>
    <div className="hidden md:block">{room.roomnumber}</div>
    <div className="hidden md:block">{room.roomType}</div>
    <div className="hidden md:block">₹{room.pricePerNight.toLocaleString()}</div>
    <div className="hidden md:block">{room.maxOccupancy} persons</div>
    <div
      className="hidden md:block font-semibold"
      style={{ color: room.available ? '#059669' : '#DC2626' }}
    >
      {room.available ? 'Available' : 'Unavailable'}
    </div>
  </div>
))}

    </div>
  );
};

export default RoomList;
