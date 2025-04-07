import React, { useEffect } from "react";
import { getAuthToken } from "../../utilities/utils";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();
      if (token) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen font-body">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-3/5 flex justify-center items-center px-4 sm:px-6 py-10 md:py-0 bg-white md:bg-gradient-to-br md:from-gray-50 md:to-blue-100">
        {children}
      </div>

      {/* Right Side - Auth Info with Image */}
      <div className="w-full md:w-2/5 relative h-64 md:h-auto">
        <img
          src="/filling-document-reception.jpg"
          alt="Login"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center px-6 text-white">
          <div className="text-center w-full max-w-md space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              Welcome to <span className="text-blue-300">Hotel PRM</span>
            </h2>

            <ul className="list-disc text-left space-y-2 text-sm md:text-base mx-auto w-full px-4">
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
                <p className="text-xs text-gray-700 font-medium">Download our</p>
                <p className="text-sm text-gray-900 font-bold">Mobile App Now</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex space-x-5 z-20">
            <img
              src="/svg/youtube-color-icon.svg"
              alt="YouTube"
              className="w-6 h-6 hover:scale-110 transition"
            />
            <img
              src="/svg/linkedin-app-icon.svg"
              alt="LinkedIn"
              className="w-6 h-6 hover:scale-110 transition"
            />
            <img
              src="/svg/ig-instagram-icon.svg"
              alt="Instagram"
              className="w-6 h-6 hover:scale-110 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
