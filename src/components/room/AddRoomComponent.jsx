import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomBulkForm from "./RoomBulkForm";
import RoomCard from "./RoomCard";
import { bulkAddRoomsAPI } from "./api";

const AddRoomComponent = () => {
  const [rooms, setRooms] = useState([]);
  const [roomCounter, setRoomCounter] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAddRooms = (values) => {
    const newRooms = Array.from({ length: values.count }, (_, idx) => ({
      id: `${Date.now()}-${idx}`,
      roomnumber: roomCounter + idx,
      floor: values.floor,
      roomType: values.type,
      pricePerNight: values.pricePerNight,
      maxOccupancy: values.maxOccupancy,
    }));
    setRooms((prev) => [...prev, ...newRooms]);
    setRoomCounter((prev) => prev + values.count);
  };

  const handleRoomChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = ["pricePerNight", "maxOccupancy", "floor"].includes(
      field
    )
      ? Number(value)
      : value;
    setRooms(updated);
  };

  const handleRemoveRoom = (id) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await bulkAddRoomsAPI(rooms);
      if (response?.status === 1) {
        navigate("/room/room-view");
      } else {
        // toast.error(response?.message || "Failed to add rooms.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      // toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 text-blue-900">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Bulk Add Rooms</h2>

      <RoomBulkForm onSubmit={handleAddRooms} />

      {rooms.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {rooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
                onChange={handleRoomChange}
                onRemove={handleRemoveRoom}
              />
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 shadow-sm"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddRoomComponent;
