// Profile.js
import React, { useState, useEffect } from 'react';
import ProfilePage from "../components/ProfilePage/ProfileComponent";
import MainLayout from "../components/layout/MainLayout";
import ChangePasswordForm from '../components/ProfilePage/ChangePasswordForm';
import { getProfile } from '../components/auth/api';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profile, setProfile] = useState(null);

  const tabs = ['Overview', 'Password', 'Notification', 'Projects', 'Invoice'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.status === 1) {
          setProfile(response.result);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-6">Settings</h1>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === activeTab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              } shadow-sm`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-xl p-4 shadow sm:p-6">
          {activeTab === 'Password' ? (
            <ChangePasswordForm />
          ) : (
            <ProfilePage activeTab={activeTab} profile={profile} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
