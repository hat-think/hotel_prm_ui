import React, { useState, useEffect } from "react";
import { getavailablehotelrooms,allocateroom } from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BookingForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [roomOptions, setRoomOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    aadharNo: [""],
    mobileNo: "",
    emailId: "",
    numberOfvisitors: 1,
    roomnumber: "",
    roomType: "",
    checkIn: today,
    checkOut: tomorrow,
    totalAmount: "",
    paidAmount: "",
    address: "",
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

  const handleAadharChange = (index, value) => {
    const updated = [...formData.aadharNo];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, aadharNo: updated }));
  };

  const addAadharField = () => {
    setFormData((prev) => ({ ...prev, aadharNo: [...prev.aadharNo, ""] }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
        const response = await allocateroom(formData);
        if (response.status === 1) {
            toast.success(response.msg);
          } else {
            toast.error(response.msg);
          }
      } catch (error) {
        console.error("Error fetching room data:", error);

      }
    if (!isRoomValid) {
      toast.error("Room number not available in hotel!");

    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
              <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Book Room</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            className="p-2 border rounded w-full"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="mobileNo">Mobile Number</label>
          <input
            id="mobileNo"
            type="tel"
            name="mobileNo"
            className="p-2 border rounded w-full"
            value={formData.mobileNo}
            onChange={handleChange}
          />
        </div>

        {/* Email ID */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="emailId">Email ID</label>
          <input
            id="emailId"
            type="email"
            name="emailId"
            className="p-2 border rounded w-full"
            value={formData.emailId}
            onChange={handleChange}
          />
        </div>

        {/* Visitors */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="numberOfvisitors">No. of Visitors</label>
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

        {/* Room Number */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="roomnumber">Room Number (Select or Enter)</label>
          <input
            list="roomnumbers"
            id="roomnumber"
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
            <p className="text-red-500 text-sm mt-1">Room number not available in hotel.</p>
          )}
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="roomType">Room Type</label>
          <select
            id="roomType"
            name="roomType"
            className="p-2 border rounded w-full"
            value={formData.roomType}
            onChange={handleChange}
          >
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        {/* Check In */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="checkIn">Check In</label>
          <input
            id="checkIn"
            type="date"
            name="checkIn"
            className="p-2 border rounded w-full"
            value={formData.checkIn}
            onChange={handleChange}
          />
        </div>

        {/* Check Out */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="checkOut">Check Out</label>
          <input
            id="checkOut"
            type="date"
            name="checkOut"
            className="p-2 border rounded w-full"
            value={formData.checkOut}
            onChange={handleChange}
          />
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="totalAmount">Total Amount</label>
          <input
            id="totalAmount"
            type="number"
            name="totalAmount"
            className="p-2 border rounded w-full bg-gray-100 text-gray-700"
            value={formData.totalAmount}
            onChange={handleChange}

          />
        </div>

        {/* Paid Amount */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="paidAmount">Paid Amount</label>
          <input
            id="paidAmount"
            type="number"
            name="paidAmount"
            className="p-2 border rounded w-full"
            value={formData.paidAmount}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            className="p-2 border rounded w-full"
            rows={3}
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Aadhar Numbers */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Aadhar Numbers</label>
          {formData.aadharNo.map((num, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Aadhar No ${index + 1}`}
              className="p-2 border rounded mb-2 w-full"
              value={num}
              onChange={(e) => handleAadharChange(index, e.target.value)}
            />
          ))}
          <button
            type="button"
            onClick={addAadharField}
            className="text-blue-600 text-sm mt-1"
          >
            + Add Aadhar
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded col-span-1 md:col-span-2 hover:bg-blue-700"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
