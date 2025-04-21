import React, { useState } from "react";
import { QrCode, ImageIcon } from "lucide-react";
import QrModal from "./QrModal";
import ImageModal from "./ImageModal";

const EmployeeCards = ({ employees, currentPage, limit, onEditClick }) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleQrClick = (employee) => {
    setSelectedEmployee(employee);
    setQrModalOpen(true);
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage("");
  };

  return (
    <>
      <div className="block md:hidden space-y-2">
        {employees.map((employee, index) => (
          <div
            key={employee._id}
            className="bg-white border rounded-lg p-4 shadow-sm text-sm"
          >
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
              <div className="col-span-2 font-medium">
                #{index + 1 + (currentPage - 1) * limit} {employee.name}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {employee.phone}
              </div>
              <div>
                <span className="font-medium">Department:</span>{" "}
                {employee.department}
              </div>
              <div>
                <span className="font-medium">Designation:</span>{" "}
                {employee.designation}
              </div>
              <div>
                <span className="font-medium">Salary:</span> {employee.salary}
              </div>
              <div>
                <span className="font-medium">Active:</span>{" "}
                {employee.isActive ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </div>
              
              {/* Documents Section */}
              <div className="col-span-2 mt-2">
                <div className="font-medium mb-1">Documents:</div>
                <div className="flex flex-wrap gap-2">
                  {employee.AadharCardFront && (
                    <button
                      onClick={() => handleImageClick(employee.AadharCardFront)}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <ImageIcon size={12} /> Aadhar Front
                    </button>
                  )}
                  {employee.AadharCardBack && (
                    <button
                      onClick={() => handleImageClick(employee.AadharCardBack)}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <ImageIcon size={12} /> Aadhar Back
                    </button>
                  )}
                  {employee.Marksheet && (
                    <button
                      onClick={() => handleImageClick(employee.Marksheet)}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <ImageIcon size={12} /> Marksheet
                    </button>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex justify-between mt-2">
                <button
                  onClick={() => onEditClick(employee)}
                  className={`font-medium hover:underline px-3 py-1 rounded ${
                    employee.isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-blue-100 bg-gray-50"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleQrClick(employee)}
                  className="font-medium hover:underline px-3 py-1 rounded text-purple-600 bg-purple-50 flex items-center gap-1"
                >
                  <QrCode size={14} /> QR Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      <QrModal
        isOpen={qrModalOpen}
        onClose={closeQrModal}
        employee={selectedEmployee}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImage}
      />
    </>
  );
};

export default EmployeeCards;