import API from "../api/axiosInstance.jsx";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Register=()=>{
    const navigate= useNavigate();
    const [form,setForm]=useState({
        name:"",
        email:"",
        phone:"",
        password:"",
        gender:"",
        dob:"",
        religion:"",
        caste:"",
        profession:""
    })


const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});

};

const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
        await API.post("/users/register",form);
         toast.success(" You've Registerd Successfully")
        navigate("/login");
    }
    catch(err){
        alert(err?.response?.data?.message || "Registration Failed");
    }

}
 return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-md space-y-5"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-700">
            Create Account
          </h2>

          {Object.entries(form).map(([key, value]) => (
            <input
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              type={key.includes("password") ? "password" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              required
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-black font-semibold py-3 rounded-xl w-full transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
  

}
export default Register;