import React, { useEffect, useState } from "react";
import { getactivevisitor } from "./api";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchReservations = async (page) => {
    try {
      const response = await getactivevisitor(page, limit);
      setReservations(response.result);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations(currentPage);
  }, [currentPage]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Booked Room</h1>
      <p className="text-gray-500 mb-4">
        Showing {reservations.length} Booked-Room(s)
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Room</th>
              <th className="px-6 py-3">Arrival</th>
              <th className="px-6 py-3">Departure</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Paid</th>
              <th className="px-6 py-3">Due</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation, index) => (
              <tr key={reservation._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{index + 1 + (currentPage - 1) * limit}
                </td>
                <td className="px-6 py-4">{reservation.name}</td>
                <td className="px-6 py-4">● {reservation.roomnumber}</td>
                <td className="px-6 py-4">
                  {reservation.checkIn?.split("T")[0]}
                </td>
                <td className="px-6 py-4">
                  {reservation.checkOut?.split("T")[0]}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reservation.paymentStatus?.toLowerCase() === "partial"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {reservation.paymentStatus?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">₹{reservation.totalAmount || 0}</td>
                <td className="px-6 py-4">₹{reservation.paidAmount || 0}</td>
                <td className="px-6 py-4 text-red-600 font-medium">
                  ₹{reservation.dueAmount || 0}
                </td>
                <td className="px-6 py-4 text-center flex justify-center items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800 transition">
                    ✏️
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition">
                    🗑️
                  </button>
                  <button className="text-green-600 hover:text-green-800 transition text-sm border border-green-500 rounded px-2 py-1">
                    Checkout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
    {/* Mobile View */}
<div className="block md:hidden">
  <div className="flex flex-col gap-3">
    {reservations.map((reservation, index) => (
      <div
        key={reservation._id}
        className="bg-white border rounded-lg p-4 shadow-sm text-sm"
      >
        <div className="font-semibold text-gray-800 mb-2">
          #{index + 1 + (currentPage - 1) * limit} — {reservation.name}
        </div>
        <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
          <div>
            <span className="font-medium">Room:</span> {reservation.roomnumber}
          </div>
          <div>
            <span className="font-medium">Payment:</span>{" "}
            <span
              className={`${
                reservation.paymentStatus?.toLowerCase() === "partial"
                  ? "text-yellow-700"
                  : "text-green-700"
              } font-semibold`}
            >
              {reservation.paymentStatus?.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="font-medium">Check In:</span>{" "}
            {reservation.checkIn?.split("T")[0]}
          </div>
          <div>
            <span className="font-medium">Check Out:</span>{" "}
            {reservation.checkOut?.split("T")[0]}
          </div>
          <div>
            <span className="font-medium">Total:</span> ₹
            {reservation.totalAmount || 0}
          </div>
          <div>
            <span className="font-medium">Paid:</span> ₹
            {reservation.paidAmount || 0}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Due:</span>{" "}
            <span className="text-red-600 font-semibold">
              ₹{reservation.dueAmount || 0}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-3 text-lg">
          <button className="text-blue-600 hover:text-blue-800">✏️</button>
          <button className="text-red-600 hover:text-red-800">🗑️</button>
          <button className="text-green-600 hover:text-green-800 text-sm border border-green-500 rounded px-2 py-1">
            Checkout
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReservationsPage;
