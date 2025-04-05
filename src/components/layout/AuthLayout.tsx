import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen font-body">
      {/* Left Side - Children (e.g. Login Form) */}
      <div className="w-1/2 flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-100">
        {children}
      </div>

      {/* Right Side - Auth Info with Image */}
      <div className="w-1/2 hidden md:flex relative h-screen">
        <img
          src="/filling-document-reception.jpg"
          alt="Login"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center px-6 text-white">
          <div className="text-center w-full max-w-md space-y-8">
            <h2 className="text-4xl font-heading font-bold text-white tracking-wide">
              Welcome to <span className="text-blue-300">Hotel PRM</span>
            </h2>

            <ul className="list-disc list-inside text-left space-y-2 text-base font-body mx-auto w-full px-4">
              <li>Effortless Booking Experience</li>
              <li>Real-Time Room Management</li>
              <li>Automated Check-In/Check-Out</li>
              <li>Mobile App for Guests & Staff</li>
            </ul>

            <div className="bg-white rounded-xl shadow-lg px-3 py-2 flex items-center space-x-3 w-full mx-auto max-w-sm">
              <img
                src="/svg/google-play-store-icon.svg"
                alt="Google Play"
                className="w-8 h-8"
              />
              <div className="text-left leading-tight">
                <p className="text-xs text-gray-700 font-medium">
                  Download our
                </p>
                <p className="text-sm text-gray-900 font-bold">
                  Mobile App Now
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 flex space-x-5 z-20">
            <img
              src="/svg/youtube-color-icon.svg"
              alt="YouTube"
              className="w-7 h-7 hover:scale-110 transition"
            />
            <img
              src="/svg/linkedin-app-icon.svg"
              alt="LinkedIn"
              className="w-7 h-7 hover:scale-110 transition"
            />
            <img
              src="/svg/ig-instagram-icon.svg"
              alt="Instagram"
              className="w-7 h-7 hover:scale-110 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
