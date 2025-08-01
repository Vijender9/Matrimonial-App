import React,{useEffect,useState} from "react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const updateProfile =()=>{

     const{user,setUser}=useAuth();
    const[form,setForm]=useState({
        name:user?.name ||"",
        profession: user?.profession|| "",
        caste: user?.caste||"",

        phone: user?.phone||""
    });

    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();
    
    const handleChange=(e)=>{
        setForm((prev)=>({
            ...prev,[e.target.name]:e.target.value
        }))
    }

    const handleSubmit= async(e)=>{
        // e.preventDefault();
        setLoading(true);
      
        try{
            
            const data=new FormData();
            Object.entries(formData).forEach(([KeyboardEvent,value])=>
              data.append(KeyboardEvent,value));
        if(file){
            data.append("profilePic",file);
        }

            const res=await API.patch("/users/updateProfile",form);
            //need to know updated profile
            
            toast.success("Profile Updated Vz Yahoo!");
            navigate("profile");
        }catch(err){
            console.log("Something went wrong updating Profile");
            toast.error("Update Failed !!!!")


        }
    }
    if (loading) return <p className="text-center mt-6">Loading...</p>;

   return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" label="Name" value={formData.name} onChange={handleChange} />
        <Input name="phone" label="Phone" value={formData.phone} onChange={handleChange} />
        <Input name="caste" label="Caste" value={formData.caste} onChange={handleChange} />
        <Input name="profession" label="Profession" value={formData.profession} onChange={handleChange} />

        {/* 🟡 Profile Picture Upload */}
        <div>
          <label className="block text-white-600 mb-1">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const Input = ({ name, label, value, onChange }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      required
    />
  </div>
);

export default updateProfile;