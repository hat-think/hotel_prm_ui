const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive"];

const RoomCard = ({ room, index, onChange, onRemove }) => (
  <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm hover:shadow-md transition text-sm space-y-3">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-blue-800">Room #{index + 1}</h3>
      <button
        onClick={() => onRemove(room.id)}
        className="text-xs text-red-600 hover:underline"
      >
        Remove
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-600">
          Room Number
        </label>
        <input
          value={room.roomnumber}
          onChange={(e) => onChange(index, "roomnumber", e.target.value)}
          className="w-full px-3 py-1.5 rounded-md border border-blue-200"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">Floor</label>
        <input
          type="number"
          value={room.floor}
          onChange={(e) => onChange(index, "floor", e.target.value)}
          className="w-full px-3 py-1.5 rounded-md border border-blue-200"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">
          Room Type
        </label>
        <select
          value={room.roomType}
          onChange={(e) => onChange(index, "roomType", e.target.value)}
          className="w-full px-3 py-1.5 rounded-md border border-blue-200"
        >
          {ROOM_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">
          Price/Night
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1.5 text-sm text-gray-500">
            ₹
          </span>
          <input
            type="number"
            value={room.pricePerNight}
            onChange={(e) => onChange(index, "pricePerNight", e.target.value)}
            className="w-full pl-6 pr-3 py-1.5 rounded-md border border-blue-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">
          Max Occupancy
        </label>
        <input
          type="number"
          value={room.maxOccupancy}
          onChange={(e) => onChange(index, "maxOccupancy", e.target.value)}
          className="w-full px-3 py-1.5 rounded-md border border-blue-200"
        />
      </div>
    </div>
  </div>
);

export default RoomCard;
