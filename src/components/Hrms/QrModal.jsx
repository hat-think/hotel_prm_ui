import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QrModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  // Function to generate employee data string for QR code
  const getEmployeeDataString = (employee) => {
    return JSON.stringify({
      name: employee.name,
      employeeId: employee.employeeId,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
    });
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${employee.name}_${employee.employeeId}_qrcode.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Employee QR Code: {employee.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="p-4 bg-white rounded border border-gray-200 mb-4">
            <QRCodeSVG
              value={getEmployeeDataString(employee)}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-2">
            <p>Scan this QR code to view employee details</p>
            <p className="mt-2 text-xs">
              Contains: Name, ID, Phone, Department, Designation
            </p>
          </div>
          
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download QR Code
          </button>
        </div>
        
        {/* Hidden SVG for QR code download */}
        <div className="hidden">
          <QRCodeSVG
            id="qr-code-svg"
            value={getEmployeeDataString(employee)}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default QrModal;