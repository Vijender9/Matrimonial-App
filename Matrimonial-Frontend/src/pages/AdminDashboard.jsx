import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPending = async () => {
    try {
      const res = await axios.get("/api/admin/pending-Profiles");
      setPendingUsers(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const approveProfile = async (userId) => {
    await axios.patch(`/api/admin/approve/${userId}`);
    fetchPending();
  };

  const rejectProfile = async (userId) => {
    await axios.patch(`/api/admin/reject/${userId}`);
    fetchPending();
  };

  const approvePhoto = async (userId) => {
    await axios.patch(`/api/admin/approve-Photo/${userId}`);
    fetchPending();
  };

  const rejectPhoto = async (userId) => {
    await axios.patch(`/api/admin/reject-Photo/${userId}`);
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Pending Profile Approvals</h2>
      {pendingUsers.length === 0 && <p>No pending profiles.</p>}
      <div className="space-y-4">
        {pendingUsers.map((user) => (
          <div key={user._id} className="p-4 border shadow rounded">
            <div className="flex items-center gap-4">
              <img
                src={user.profilePic || "/default.jpg"}
                alt="profile"
                className="h-20 w-20 object-cover rounded-full"
              />
              <div>
                <h3 className="font-bold">{user.name}</h3>
                <p>{user.email}</p>
                <p><strong>Photo:</strong> {user.photoStatus}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={() => approveProfile(user._id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve Profile</button>
              <button onClick={() => rejectProfile(user._id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject Profile</button>
              <button onClick={() => approvePhoto(user._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Approve Photo</button>
              <button onClick={() => rejectPhoto(user._id)} className="bg-yellow-500 text-black px-3 py-1 rounded">Reject Photo</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
