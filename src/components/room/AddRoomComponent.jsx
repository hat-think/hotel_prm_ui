import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive"];

const bulkSchema = Yup.object().shape({
  count: Yup.number().min(1, "Minimum 1 room").required("Required"),
  floor: Yup.number().min(0, "Floor must be 0 or higher").required("Required"),
  type: Yup.string().required("Room type is required"),
});

const AddRoomComponent = () => {
  const [rooms, setRooms] = useState([]);
  const [roomCounter, setRoomCounter] = useState(100);
  const navigate = useNavigate();

  const handleAddRooms = (values) => {
    const newRooms = Array.from({ length: values.count }, (_, idx) => ({
      id: `${Date.now()}-${idx}`,
      roomNumber: roomCounter + idx,
      floor: values.floor,
      type: values.type,
    }));
    setRooms((prev) => [...prev, ...newRooms]);
    setRoomCounter((prev) => prev + values.count);
  };

  const handleRoomChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = field === "floor" ? Number(value) : value;
    setRooms(updated);
  };

  const handleRemoveRoom = (id) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const handleSubmit = async () => {
    console.log("Submitted Rooms:", rooms);
    navigate("/room/view");
  };

  return (
    <div className="max-w-8xl mx-auto p-0 text-blue-900">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Bulk Add Rooms</h2>

      <Formik
        initialValues={{ count: 1, floor: 1, type: "Standard" }}
        validationSchema={bulkSchema}
        onSubmit={handleAddRooms}
      >
        <Form className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-wrap gap-3 items-end border border-blue-100">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium mb-1">
              Number of Rooms
            </label>
            <Field
              name="count"
              type="number"
              className="w-full px-3 py-2 text-sm rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <ErrorMessage
              name="count"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium mb-1">Floor</label>
            <Field
              name="floor"
              type="number"
              className="w-full px-3 py-2 text-sm rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <ErrorMessage
              name="floor"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <Field
              name="type"
              as="select"
              className="w-full px-3 py-2 text-sm rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {ROOM_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Field>
            <ErrorMessage
              name="type"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <button
            type="submit"
            className="ml-auto mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md shadow-sm transition"
          >
            Add
          </button>
        </Form>
      </Formik>

      {rooms.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm transition hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-medium text-blue-800">
                    Room #{index + 1}
                  </h3>
                  <button
                    onClick={() => handleRemoveRoom(room.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Room Number
                    </label>
                    <input
                      value={room.roomNumber}
                      onChange={(e) =>
                        handleRoomChange(index, "roomNumber", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-md border border-blue-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Floor
                    </label>
                    <input
                      type="number"
                      value={room.floor}
                      onChange={(e) =>
                        handleRoomChange(index, "floor", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-md border border-blue-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Room Type
                    </label>
                    <select
                      value={room.type}
                      onChange={(e) =>
                        handleRoomChange(index, "type", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-md border border-blue-200 text-sm"
                    >
                      {ROOM_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 shadow-sm transition"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddRoomComponent;
