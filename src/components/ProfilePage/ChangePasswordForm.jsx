import React, { useState } from 'react';
import { sendemailotp, changepassword } from '../auth/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await sendemailotp();
      console.log('OTP sent response:', response);
      if (response.status === 1) {
        toast.success(response.msg || 'OTP sent to your email!');
        setOtpSent(true);
      } else {
        toast.error(response.msg || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.warn("New passwords don't match!");
      return;
    }

    const data = {
      oldPassword: currentPassword,
      newPassword: newPassword,
      otp: otp,
    };

    try {
      setIsLoading(true);
      const response = await changepassword(data);
      console.log('Change password response:', response);
      if (response.status === 1) {
        toast.success(response.msg || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
        setOtpSent(false);
      } else {
        toast.error(response.msg || 'Failed to change password.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error changing password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Current Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Confirm New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {otpSent && (
          <div>
            <label className="block text-sm text-gray-700">OTP</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        {!otpSent ? (
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            📧 {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={isLoading}
          >
            🔒 {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
