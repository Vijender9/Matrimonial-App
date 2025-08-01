import axios from "axios";
import { useContext, useState } from "react";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Login= ()=>{
  const{login}= useContext(AuthContext);

  console.log("{login is }",login)

  const[form, setForm]=useState({
    email:"",
    password:""
  })

   const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value});

   }
   const handleSubmit= async(e)=>{

    e.preventDefault();
    try{
      
       const res=await API.post("/users/login",form);
        
        console.log("resposne is:",res)
        login(res.data.data.token);


    }catch(err){
        alert(err?.response?.data?.message||"Login failed! vz")
    }

   }


   return(
    
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          
          className="bg-blue-600 hover:bg-blue-700 text-black font-semibold py-3 rounded-xl w-full transition"
        >
          Login
        </button>
      </form>
    </div>
  );

}
export default Login;