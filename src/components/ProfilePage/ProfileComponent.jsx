// ProfilePage.js (inside ../components/ProfilePage/ProfileComponent.js)
import React from 'react';

const ProfilePage = ({profile }) => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{profile?.name || 'Loading...'}</h2>
              <span className="text-gray-500">Hotel</span>
              <span className="text-xs ml-2 text-white bg-blue-500 px-2 py-0.5 rounded">PRO</span>
            </div>
          </div>
          <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">
            ✏️ Edit
          </button>
        </div>

        {/* Editable Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Timezone</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option>UTC-08:00 - PST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Language</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option>Choose your account type</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Date of Birth</label>
              <input type="date" className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Gender</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option>Choose your gender</option>
              </select>
            </div>
          </div>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            💾 Save
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Personal information</h2>
        {profile ? (
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <p><strong>Full name:</strong> {profile.name}</p>
              <p className="mt-2">
                <strong>Biography:</strong><br />
                {profile.description}
              </p>
              <p className="mt-2">
                <strong>Social:</strong> 🌐 <a href={profile.contact.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{profile.contact.website}</a>
              </p>
              <p className="mt-2"><strong>Location:</strong> {profile.address.city}, {profile.address.state}, {profile.address.country}</p>
              <p className="mt-2"><strong>Job Title:</strong> Hotel</p>
            </div>
            <div>
              <p><strong>Email Address:</strong> {profile.contact.email}</p>
              <p className="mt-2"><strong>Home Address:</strong> {profile.address.street}, {profile.address.city}, {profile.address.postalCode}, {profile.address.country}</p>
              <p className="mt-2"><strong>Phone Number:</strong> {profile.contact.phone}</p>
              <p className="mt-2"><strong>Status:</strong> {profile.status === 1 ? 'Active' : 'Inactive'}</p>
              <p className="mt-2"><strong>Created At:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p>Loading profile data...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
