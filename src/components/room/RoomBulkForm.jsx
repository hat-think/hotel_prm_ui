import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive"];

export const bulkSchema = Yup.object().shape({
  count: Yup.number().min(1, "Minimum 1 room").required("Required"),
  floor: Yup.number().min(0, "Floor must be 0 or higher").required("Required"),
  type: Yup.string().required("Room type is required"),
  pricePerNight: Yup.number()
    .min(0, "Price must be positive")
    .required("Required"),
  maxOccupancy: Yup.number()
    .min(1, "Must allow at least 1 person")
    .required("Required"),
});

const RoomBulkForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        count: 1,
        floor: 1,
        type: "Standard",
        pricePerNight: 1500,
        maxOccupancy: 2,
      }}
      validationSchema={bulkSchema}
      onSubmit={onSubmit}
    >
      <Form className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-wrap gap-4 items-end border border-blue-100">
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium mb-1">Rooms</label>
          <Field
            name="count"
            type="number"
            className="w-full px-3 py-2 text-sm rounded-md border border-blue-200"
          />
          <ErrorMessage
            name="count"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium mb-1">Floor</label>
          <Field
            name="floor"
            type="number"
            className="w-full px-3 py-2 text-sm rounded-md border border-blue-200"
          />
          <ErrorMessage
            name="floor"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <Field
            name="type"
            as="select"
            className="w-full px-3 py-2 text-sm rounded-md border border-blue-200"
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
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium mb-1">
            Price/Night (₹)
          </label>
          <Field
            name="pricePerNight"
            type="number"
            className="w-full px-3 py-2 text-sm rounded-md border border-blue-200"
          />
          <ErrorMessage
            name="pricePerNight"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <label className="block text-sm font-medium mb-1">
            Max Occupancy
          </label>
          <Field
            name="maxOccupancy"
            type="number"
            className="w-full px-3 py-2 text-sm rounded-md border border-blue-200"
          />
          <ErrorMessage
            name="maxOccupancy"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <button
          type="submit"
          className="ml-auto mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md"
        >
          Add
        </button>
      </Form>
    </Formik>
  );
};

export default RoomBulkForm;
