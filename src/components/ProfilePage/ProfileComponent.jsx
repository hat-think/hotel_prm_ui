import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaEnvelope,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";
import { sendemailotp, verifyotp, updateaddress } from "../auth/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = ({ profile }) => {
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editAddressMode, setEditAddressMode] = useState(false);

  const [addressForm, setAddressForm] = useState({
    street: profile?.address?.street || "",
    city: profile?.address?.city || "",
    state: profile?.address?.state || "",
    postalCode: profile?.address?.postalCode || "",
    country: profile?.address?.country || "",
  });

  const handlePhoneVerify = () => {
    // TODO: Connect to backend verify phone API if needed
    toast.success("Phone number verified successfully!");
    setPhoneOtp("");
    setPhoneOtpSent(false);
  };

  const handleEmailVerify = async () => {
    try {
      setIsLoading(true);
      const response = await verifyotp({ otp: emailOtp });
      if (response.status === 1) {
        toast.success(response.msg);
        setEmailOtpSent(false);
        setEmailOtp("");
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error verifying OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailOtp = async () => {
    try {
      setIsLoading(true);
      const response = await sendemailotp();
      if (response.status === 1) {
        toast.success(response.msg || "OTP sent to your email!");
        setEmailOtpSent(true);
      } else {
        toast.error(response.msg || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = () => {
    // TODO: Connect to backend send phone OTP if needed
    toast.success("OTP sent to your phone!");
    setPhoneOtpSent(true);
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

    const handleAddressSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await updateaddress(addressForm);
      if (response.status === 1) {
        toast.success(response.msg || "Address updated successfully!");
        setEditAddressMode(false);
      } else {
        toast.error(response.msg || "Failed to Address updated successfully!.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error Address updated successfully!.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800">
                {profile?.name || "Loading..."}
              </h2>
              <p className="text-sm text-gray-500">Hotel</p>
              <span className="text-xs text-white bg-blue-500 px-2 py-0.5 rounded-full inline-block mt-1">
                PRO
              </span>
            </div>
          </div>
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
            ✏️ Edit Profile
          </button>
        </div>

        {/* Info Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h2>
          {profile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
              {/* Left side info */}
              <div className="space-y-3">
                <p>
                  <strong>Hotel Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Biography:</strong>
                  <br />
                  {profile.description}
                </p>
                <p className="flex items-center gap-1 flex-wrap">
                  <FaGlobe />
                  <strong>Website:</strong>{" "}
                  <a
                    href={profile.contact.website}
                    className="text-blue-600 underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.contact.website}
                  </a>
                </p>
                <p className="flex items-center gap-1 flex-wrap">
                  <FaMapMarkerAlt />
                  <strong>Location:</strong>{" "}
                  {profile.address?.city &&
                  profile.address?.state &&
                  profile.address?.country ? (
                    <>
                      {profile.address.city}, {profile.address.state},{" "}
                      {profile.address.country}
                    </>
                  ) : (
                    <span className="text-red-500">Address not provided</span>
                  )}
                </p>

                {!editAddressMode &&
                  (!profile.address?.city ||
                    !profile.address?.state ||
                    !profile.address?.country) && (
                    <button
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => setEditAddressMode(true)}
                    >
                      📍 Update Address
                    </button>
                  )}

                <p className="flex items-center gap-1">
                  <FaUserTie />
                  <strong>Job Title:</strong> Hotel
                </p>
              </div>

              {/* Right side info */}
              <div className="space-y-3">
                <p className="flex items-center gap-1 flex-wrap">
                  <FaEnvelope />
                  <strong>Email:</strong> {profile.contact.email}
                  {profile.contact.emailverify && (
                    <FaCheckCircle className="text-green-600 ml-1" />
                  )}
                </p>

                {!profile.contact.emailverify && (
                  <>
                    {!emailOtpSent ? (
                      <button
                        onClick={sendEmailOtp}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Email OTP"
                          className="border rounded px-3 py-1 w-full sm:w-auto flex-grow"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                        />
                        <button
                          onClick={handleEmailVerify}
                          disabled={!emailOtp}
                          className={`px-4 py-1 rounded text-white ${
                            emailOtp
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </>
                )}

                <p className="flex items-center gap-1 flex-wrap">
                  <FaPhoneAlt />
                  <strong>Phone:</strong> {profile.contact.phone}
                  {profile.contact.phoneverify && (
                    <FaCheckCircle className="text-green-600 ml-1" />
                  )}
                </p>

                {!profile.contact.phoneverify && (
                  <>
                    {!phoneOtpSent ? (
                      <button
                        onClick={sendPhoneOtp}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Phone OTP"
                          className="border rounded px-3 py-1 w-full sm:w-auto flex-grow"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                        />
                        <button
                          onClick={handlePhoneVerify}
                          disabled={!phoneOtp}
                          className={`px-4 py-1 rounded text-white ${
                            phoneOtp
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Home Address */}
                <p>
                  <strong>Home Address:</strong>{" "}
                  {profile.address?.street &&
                  profile.address?.city &&
                  profile.address?.postalCode &&
                  profile.address?.country ? (
                    <>
                      {profile.address.street}, {profile.address.city},{" "}
                      {profile.address.postalCode}, {profile.address.country}
                    </>
                  ) : (
                    <span className="text-red-500">Address not provided</span>
                  )}
                </p>

                {editAddressMode && (
                  <div className="space-y-2 border-t pt-4">
                    <h4 className="font-semibold text-gray-800">
                      Update Address
                    </h4>
                    {["street", "city", "state", "postalCode", "country"].map(
                      (field) => (
                        <input
                          key={field}
                          type="text"
                          name={field}
                          placeholder={field}
                          value={addressForm[field]}
                          onChange={handleAddressChange}
                          className="border w-full px-3 py-1 rounded"
                        />
                      )
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleAddressSubmit}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setEditAddressMode(false)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p>
                  <strong>Status:</strong>{" "}
                  {profile.status === 1 ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
