import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios"; // ✅ Add this if not already
import API from "../api/axiosInstance.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadUserCount, setUnreadUserCount] = useState(0); // ✅ new state

  // ✅ Fetch unread message count when user is logged in
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/messages/unreadCounts")
          //  {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        const unreadSenders = res.data?.data || [];
        setUnreadUserCount(unreadSenders.length); // how many users sent unread messages
      } catch (err) {
        console.log("Error fetching unread count:", err);
      }
    };

    fetchUnreadCounts();
  }, [user]); // ✅ run when user is available

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-900 text-black px-6 py-4 shadow flex justify-between items-center gap-6">
      <div>
        <Link to="/" className="text-4xl font-bold">
          💍 MatrimonialApp
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">Home</Link>

        {user && (
          <>
            <Link to="/adminDashboard" className="hover:underline">Admin DashBoard</Link>
            <Link to="/matches" className="hover:underline">Matches</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/search" className="hover:underline">Search</Link>
            <Link to="/shortlist" className="hover:underline">ShortList</Link>

            {/* ✅ Chat link with unread badge */}
            <div className="relative">
              <Link to="/recentChats" className="hover:underline">Chats</Link>
              {unreadUserCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadUserCount}
                </span>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <img
                src={user.profilePic || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <span className="hidden md:inline font-medium">
                {user.name?.split(" ")[0]}
              </span>
            </div>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
