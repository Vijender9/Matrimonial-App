import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const Search = () => {

    console.log("im currently in search page at frontend")
  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    caste: "",
    profession: "",
  });

  const [results, setResults] = useState([]);
  const [shortlistedIds, setShortlistedIds] = useState([]); // 💡 to store already shortlisted user IDs
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 🔄 Fetch shortlisted users for current user
  const fetchShortlistedIds = async () => {
    try {
      const { data } = await API.get("/shortlists/shortlisted");
      const ids = data.data.map((entry) => String(entry.to._id));
      console.log("Shortlisted fetched IDs:", ids);
      setShortlistedIds(ids);
    } catch (err) {
      console.error("Failed to fetch shortlist", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/users/search", {
        params: filters,
      });
      console.log("fetched users data:",data);
      setResults(data.data);
    } catch (err) {
      toast.error("Error while searching users");
    }
    setLoading(false);
  };

  const handleShortlist = async (userId) => {
    try {
      await API.post(`/shortlists/${userId}`);
      setShortlistedIds((prev) => [...prev, userId]);
      toast.success("User shortlisted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to shortlist");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchShortlistedIds();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🔍 Find Matches</h2>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <select name="gender" value={filters.gender} onChange={handleChange} className="p-2 border rounded">
          <option value="">Any Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          name="religion"
          value={filters.religion}
          onChange={handleChange}
          placeholder="Religion"
          className="p-2 border rounded"
        />

        <input
          name="caste"
          value={filters.caste}
          onChange={handleChange}
          placeholder="Caste"
          className="p-2 border rounded"
        />

        <input
          name="profession"
          value={filters.profession}
          onChange={handleChange}
          placeholder="Profession"
          className="p-2 border rounded"
        />
      </div>

      <button onClick={fetchUsers} className="bg-blue-600 text-black px-4 py-2 rounded mb-4">
        Apply Filters
      </button>

      {/* Results */}
      {loading ? (
        <p>Loading matches...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No matches found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((user) => {
            const isShortlisted = shortlistedIds.includes(String(user._id));
            console.log("userselectid:",user._id);
            console.log("ishortlised:",isShortlisted)
            return (
              <div key={user._id} className="p-4 border shadow rounded">
                <img
                src={user.profilePic || "/default-avatar.png"}
                alt={`${user.name}'s profile`}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border"
              />

                <h3 className="text-lg font-semibold">
                  {user.name} {isShortlisted && "⭐"}
                </h3>
                <p>{user.gender}, {user.religion}, {user.caste}</p>
                <p>{user.profession}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>

                <button
                  onClick={() => handleShortlist(user._id)}
                  disabled={isShortlisted}
                  className={`mt-2 px-3 py-1 rounded text-black ${
                    isShortlisted ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  💖 {isShortlisted ? "Shortlisted" : "Shortlist"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
