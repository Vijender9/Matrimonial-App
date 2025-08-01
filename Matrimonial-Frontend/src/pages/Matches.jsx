// ✅ Matches.jsx — show mutual matches with Chat button
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/shortlists/matches")
      .then((res) => {
        setMatches(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches", err);
        setLoading(false);
        toast.error("Failed to load matches");
      });
  }, []);

  const handleChat = (userId) => {
    console.log("userId of other",userId)
    navigate(`/chat/${userId}`
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">💞 Your Mutual Matches</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500">No mutual matches found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((user) => (
            <div key={user._id} className="p-4 border shadow rounded">
              <img
                src={user.profilePic || "https://via.placeholder.com/100"}
                alt="profile"
                className="w-20 h-20 object-cover rounded-full mb-2"
              />
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p>{user.profession}</p>
              <p>{user.religion}, {user.caste}</p>
              <p className="text-sm text-gray-500">{user.email}</p>

              <button
                onClick={() => handleChat(user._id)}
                className="bg-green-600 text-black px-4 py-2 mt-3 rounded hover:bg-green-700"
              >
                💬 Start Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;