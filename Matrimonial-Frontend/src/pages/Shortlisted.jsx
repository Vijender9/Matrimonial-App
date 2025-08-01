import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";

const Shortlisted = () => {
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlist = async () => {
    try {
      const { data } = await API.get("/shortlists/shortlisted");
      setShortlist(data.data);
    } catch (err) {
      console.error("Failed to load shortlist", err);
    }
    setLoading(false);
  };

  const removeFromShortlist = async (userId) => {
    try {
      await API.delete(`/shortlists/${userId}`);
      setShortlist(shortlist.filter((item) => item.to._id !== userId));
    } catch (err) {
      alert("Failed to remove user");
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading your shortlisted users...</p>;

  if (!shortlist.length) return <p className="text-center text-red-500">No shortlisted users yet.</p>;

  return (
    <div className=" bg-grey-900 max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">💖 Your Shortlisted Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shortlist.map((item) => {
          const user = item.to;
          return (
            <div key={user._id} className=" bg-pink-100 p-4 border shadow rounded">
                <img
                src={user.profilePic || "/default-avatar.png"}
                alt={`${user.name}'s profile`}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border"
              />
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p>{user.gender}, {user.religion}, {user.caste}</p>
              <p>{user.profession}</p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>

              <button
                onClick={() => removeFromShortlist(user._id)}
                className="bg-red-500 text-black px-3 py-1 mt-2 rounded hover:bg-red-600"
              >
                ❌ Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shortlisted;
