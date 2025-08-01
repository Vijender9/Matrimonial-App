import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);
  const [file, setFile] = useState(null);
  const {user,setUser}=useAuth();

  useEffect(() => {
    API.get("/users/currentUser")
      .then((res) => {
        setFormData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) {
        data.append("profilePic", file);
      }

      const res = await API.patch("/users/updateProfile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

         console.log("updated user frontend:",res);
         const updatedUser = res.data.data;
            console.log("updatedUser !!",updatedUser)
            setUser(updatedUser);

      setSuccess("✅ Profile updated successfully!");
      toast.success("Profile Updated!!");
      setFormData(res.data.data); // update UI with latest info
      setEditing(false);
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (!formData) return <p className="text-center text-red-500">No profile found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">👤 Your Profile</h2>

      {formData?.profilePic && (
        <div className="flex justify-center mb-4">
          <img
            src={formData.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}

      {success && <p className="text-green-600 text-center mb-2">{success}</p>}

      {!editing ? (
        <>
          <div className="space-y-2 mb-4">
            <ProfileItem label="Name" value={formData.name} />
            <ProfileItem label="Email" value={formData.email} />
            <ProfileItem label="Phone" value={formData.phone} />
            <ProfileItem label="Gender" value={formData.gender} />
            <ProfileItem label="DOB" value={formData.dob} />
            <ProfileItem label="Religion" value={formData.religion} />
            <ProfileItem label="Caste" value={formData.caste} />
            <ProfileItem label="Profession" value={formData.profession} />
          </div>
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-blue-600 text-black py-2 rounded"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            "name", "email", "phone", "gender",
            "dob", "religion", "caste", "profession"
          ].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              placeholder={field}
              className="w-full p-2 border rounded"
            />
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-green-600 text-black py-2 rounded"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-400 text-black py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between border-b pb-1">
    <span className="text-gray-600">{label}:</span>
    <span className="font-semibold">{value || "N/A"}</span>
  </div>
);

export default Profile;
