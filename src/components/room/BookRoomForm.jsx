import React, { useState, useEffect } from "react";
import { getavailablehotelrooms, allocateroom } from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [roomOptions, setRoomOptions] = useState([]);
  const [formData, setFormData] = useState({
    roomnumber: "",
    roomType: "",
    numberOfvisitors: 1,
    checkIn: today,
    checkOut: tomorrow,
    totalAmount: "",
    paidAmount: "",
    address: "",
    guests: [
      {
        name: "",
        mobileNo: "",
        emailId: "",
        aadharNo: "",
      },
    ],
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getavailablehotelrooms();
        if (res.status === 1 && Array.isArray(res.result)) {
          setRoomOptions(res.result);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRooms();
  }, []);

  const isRoomValid = roomOptions.some(
    (room) => room.roomnumber.toString() === formData.roomnumber
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "roomnumber") {
      const selectedRoom = roomOptions.find(
        (room) => room.roomnumber.toString() === value
      );

      if (selectedRoom) {
        setFormData((prev) => ({
          ...prev,
          roomnumber: value,
          totalAmount: selectedRoom.pricePerNight,
          paidAmount: selectedRoom.pricePerNight,
          roomType: selectedRoom.roomType,

        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          roomnumber: value,
          totalAmount: "",
          paidAmount: "",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGuestChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGuests = [...formData.guests];
    updatedGuests[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      guests: updatedGuests,
    }));
  };

  const addGuest = () => {
    setFormData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        { name: "", mobileNo: "", emailId: "", aadharNo: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRoomValid) {
      toast.error("Room number not available in hotel!");
      return;
    }

    try {
      const response = await allocateroom(formData);
      if (response.status === 1) {
        toast.success(response.msg);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Hotel Booking Form</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* --- Hotel Info Section --- */}
        <div className="md:col-span-2 mb-2">
          <h3 className="text-xl font-semibold mb-2">Hotel Info</h3>
        </div>

        {/* Room Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Room Number</label>
          <input
            list="roomnumbers"
            name="roomnumber"
            className="p-2 border rounded w-full"
            value={formData.roomnumber}
            onChange={handleChange}
          />
          <datalist id="roomnumbers">
            {roomOptions.map((room) => (
              <option key={room._id} value={room.roomnumber} />
            ))}
          </datalist>
          {formData.roomnumber && !isRoomValid && (
            <p className="text-red-500 text-sm mt-1">Room not available.</p>
          )}
        </div>

        {/* Room Type */}
        <div className="flex gap-4">
  {/* Room Type */}
  <div className="flex-1">
    <label className="block text-sm font-medium mb-1">Room Type</label>
    <input
      name="roomType"
      className="p-2 border rounded w-full"
      value={formData.roomType}
      onChange={handleChange}
    />
  </div>

  {/* Number of Visitors */}
  <div className="flex-1">
    <label className="block text-sm font-medium mb-1">Number of Visitors</label>
    <input
      id="numberOfvisitors"
      type="number"
      name="numberOfvisitors"
      className="p-2 border rounded w-full"
      min={1}
      value={formData.numberOfvisitors}
      onChange={handleChange}
    />
  </div>
</div>


        {/* Check In */}
        <div>
          <label className="block text-sm font-medium mb-1">Check In</label>
          <input
            type="date"
            name="checkIn"
            className="p-2 border rounded w-full"
            value={formData.checkIn}
            min={today}
            onChange={handleChange}
          />
        </div>

        {/* Check Out */}
        <div>
          <label className="block text-sm font-medium mb-1">Check Out</label>
          <input
            type="date"
            name="checkOut"
            className="p-2 border rounded w-full"
            value={formData.checkOut}
            min={formData.checkIn}
            onChange={handleChange}
          />
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            className="p-2 border rounded w-full bg-gray-100"
            value={formData.totalAmount}
            onChange={handleChange}
          />
        </div>

        {/* Paid Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Paid Amount</label>
          <input
            type="number"
            name="paidAmount"
            className="p-2 border rounded w-full"
            value={formData.paidAmount}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            name="address"
            className="p-2 border rounded w-full"
            rows={3}
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* --- Guest Info Section --- */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-xl font-semibold mb-2">Guest Info</h3>
        </div>

        {formData.guests.map((guest, index) => (
          <div
            key={index}
            className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
          >
            <input
              type="text"
              placeholder="Guest Name"
              name="name"
              className="p-2 border rounded w-full"
              value={guest.name}
              onChange={(e) => handleGuestChange(index, e)}
            />
            <input
              type="tel"
              placeholder="Mobile No"
              name="mobileNo"
              className="p-2 border rounded w-full"
              value={guest.mobileNo}
              onChange={(e) => handleGuestChange(index, e)}
            />
            <input
              type="email"
              placeholder="Email ID"
              name="emailId"
              className="p-2 border rounded w-full"
              value={guest.emailId}
              onChange={(e) => handleGuestChange(index, e)}
            />
            <input
              type="text"
              placeholder="Aadhar Number"
              name="aadharNo"
              className="p-2 border rounded w-full"
              value={guest.aadharNo}
              onChange={(e) => handleGuestChange(index, e)}
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={addGuest}
            className="text-blue-600 text-sm"
          >
            + Add Another Guest
          </button>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
