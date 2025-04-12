import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Phone, Mail, IdCard } from "lucide-react";

const GuestDetails = () => {
  const location = useLocation();
  const guests = location.state?.guests || [];
  const navigate = useNavigate();

  console.log("guests", guests);
  const handleBookRoom = () => {
    navigate("/room/Book-Room");
  };
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 ">Guests Room</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 ">Showing {guests.length} Guests-Room(s)</p>
        <button
          onClick={handleBookRoom} // Replace with your booking function
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Book Room
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3"><User size={16} className="inline mr-1" />name</th>
              <th className="px-6 py-3"><Phone size={16} className="inline mr-1" />mobileNo</th>
              <th className="px-6 py-3"><Mail size={16} className="inline mr-1" />emailId</th>
              <th className="px-6 py-3"><IdCard size={16} className="inline mr-1" />aadharNo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guests.map((guest, index) => (
              <tr key={guest._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{index + 1}
                </td>
                <td className="px-6 py-4">{guest.name} </td>
                <td className="px-6 py-4">● {guest.mobileNo}</td>
                <td className="px-6 py-4">{guest.emailId || 0}</td>
                <td className="px-6 py-4">{guest.aadharNo || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-3">
          {guests.map((guest, index) => (
            <div
              key={guest._id}
              className="bg-white border rounded-lg p-4 shadow-sm text-sm"
            >
              <div className="font-semibold text-gray-800 mb-2">
                #{index + 1}
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                <div className="flex items-center">
                  <User size={16} className="mr-1"/>
                  <span className="font-medium">Name:</span> {guest.name}
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-1"/>
                  <span className="font-medium"></span> {guest.mobileNo}
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-1"/>
                  <span className="font-medium"></span> {guest.emailId || 0}
                </div>
                <div className="flex items-center">
                  <IdCard size={16} className="mr-1"/>
                  <span className="font-medium"></span> {guest.aadharNo || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;