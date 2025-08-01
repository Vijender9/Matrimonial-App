import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-pink-700">💍 Welcome to Matrimonial Connect</h1>

        <p className="text-gray-600 text-lg">
          Find your perfect match based on religion, caste, profession, and more. <br />
          Secure. Simple. Personalized.
        </p>

        {user && (
          <div className="flex flex-col items-center space-y-2">
            <img
              src={user.profilePic || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-pink-500 object-cover"
            />
            <p className="text-lg font-semibold">Hi, {user.name}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link to="/search">
            <button className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full">
              🔍 Find Matches
            </button>
          </Link>
          <Link to="/profile">
            <button className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 w-full">
              👤 My Profile
            </button>
          </Link>
          <Link to="/shortlist">
            <button className="bg-pink-600 text-black px-4 py-2 rounded hover:bg-pink-700 w-full">
              ❤️ My Shortlist
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
