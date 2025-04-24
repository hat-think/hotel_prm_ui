import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ImageIcon, Download } from "lucide-react";

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
      // Include image URLs in the QR data if needed
      aadharFront: employee.AadharCardFront,
      marksheet: employee.Marksheet
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Employee Details: {employee.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          {/* Employee Photo (if available) */}
          {employee.profilePhoto && (
            <div className="mb-4">
              <img 
                src={employee.profilePhoto} 
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100?text=No+Photo";
                }}
              />
            </div>
          )}
          
          {/* QR Code */}
          <div className="p-4 bg-white rounded border border-gray-200 mb-4">
            <QRCodeSVG
              value={getEmployeeDataString(employee)}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          
          {/* Employee Details */}
          <div className="w-full mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">ID:</span> {employee.employeeId}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {employee.phone}
              </div>
              <div>
                <span className="font-medium">Dept:</span> {employee.department}
              </div>
              <div>
                <span className="font-medium">Role:</span> {employee.designation}
              </div>
            </div>
          </div>
          
          {/* Document Links */}
          <div className="w-full mb-4">
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <ImageIcon size={16} /> Documents
            </h4>
            <div className="flex flex-wrap gap-2">
              {employee.AadharCardFront && (
                <a 
                  href={`https://log.tokame.network/${employee.AadharCardFront}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                >
                  Aadhar Front
                </a>
              )}
              {employee.AadharCardBack && (
                <a 
                  href={`https://log.tokame.network/${employee.AadharCardBack}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                >
                  Aadhar Back
                </a>
              )}
              {employee.Marksheet && (
                <a 
                  href={`https://log.tokame.network/${employee.Marksheet}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                >
                  Marksheet
                </a>
              )}
            </div>
          </div>
          
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Download size={16} /> Download QR Code
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