import React, { useEffect, useState } from "react";
import { gethotelrooms, updateroom } from "./api"; // Replace with your actual API
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Building2,
  IndianRupee,
  Users,
  CheckCircle,
  XCircle,
  Hash,
  PencilLine,
} from "lucide-react";



const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Form state
  const [editType, setEditType] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOccupancy, setEditOccupancy] = useState("");
  const [editroomnumber, setRoomnumber] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

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

  const totalPages = Math.ceil(rooms.length / limit);

  const handleBookRoom = () => {
    navigate("/room/Book-Room");
  };

  const handlePageChange = (type) => {
    if (type === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
    if (type === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleEditClick = (room) => {
    setEditingRoom(room);
    setEditType(room.roomType);
    setEditPrice(room.pricePerNight);
    setEditOccupancy(room.maxOccupancy);
    setRoomnumber(room.roomnumber);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedRoom = {
      roomType: editType,
      pricePerNight: Number(editPrice),
      maxOccupancy: Number(editOccupancy),
      roomnumber: Number(editroomnumber),

    };

    const res = await updateroom(updatedRoom);
    if (res.status) {
      toast.success("Room updated successfully!");
      handleModalClose();
      fetchRooms(); // refresh list
    } else {
      toast.error("Failed to update room.");
    }
  };

  const paginatedRooms = rooms.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Booked Rooms</h1>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500">Total: {rooms.length} room(s)</p>
        <button
          onClick={handleBookRoom}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Book Room
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200 hidden md:block">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-center">
                <Hash size={16} />#
              </th>
              <th className="px-4 py-3 text-center">
                <BedDouble size={16} /> Room No.
              </th>
              <th className="px-4 py-3 text-center">
                <Building2 size={16} /> Type
              </th>
              <th className="px-4 py-3 text-center">
                <IndianRupee size={16} /> Price
              </th>
              <th className="px-4 py-3 text-center">
                <Users size={16} /> Occupancy
              </th>
              <th className="px-4 py-3 text-center">
                <CheckCircle size={16} /> Available
              </th>
              <th className="px-4 py-3 text-center">
                <PencilLine size={16} /> Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRooms.map((room, index) => (
              <tr key={room._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">
                  #{index + 1 + (currentPage - 1) * limit}
                </td>
                <td className="px-6 py-4">{room.roomnumber}</td>
                <td className="px-6 py-4">{room.roomType}</td>
                <td className="px-6 py-4">₹{room.pricePerNight}</td>
                <td className="px-6 py-4">{room.maxOccupancy}</td>
                <td className="px-6 py-4">
                  {room.available ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle size={14} /> Yes
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <XCircle size={14} /> No
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {room.available ? (
                    <button
                      onClick={() => handleEditClick(room)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="text-blue-100 hover:underline cursor-pointer">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
            <h2 className="text-lg font-semibold mb-4">
              Edit Room #{editingRoom?.roomnumber}
            </h2>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full mt-1 border rounded p-2"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="w-full mt-1 border rounded p-2"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Occupancy</label>
                <input
                  type="number"
                  className="w-full mt-1 border rounded p-2"
                  value={editOccupancy}
                  onChange={(e) => setEditOccupancy(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      {/* Mobile Cards */}
      <div className="block md:hidden space-y-2">
        {paginatedRooms.map((room, index) => (
          <div
            key={room._id}
            className="bg-white border rounded-lg p-4 shadow-sm text-sm"
          >
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
              <div>
                <span className="font-medium">
                  #{index + 1 + (currentPage - 1) * limit} Room No:
                </span>{" "}
                {room.roomnumber}
              </div>
              <div>
                <span className="font-medium">Type:</span> {room.roomType}
              </div>
              <div>
                <span className="font-medium">Price:</span> ₹
                {room.pricePerNight}
              </div>
              <div>
                <span className="font-medium">Occupancy:</span>{" "}
                {room.maxOccupancy}
              </div>
              <div>
                <span className="font-medium">Available:</span>{" "}
                {room.available ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-600 font-medium">No</span>
                )}
              </div>

              <div className="text-red-600 font-medium">
                {room.available ? (
                  <button
                    onClick={() => handleEditClick(room)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(room)}
                    className="text-blue-100 font-medium hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoomList;
