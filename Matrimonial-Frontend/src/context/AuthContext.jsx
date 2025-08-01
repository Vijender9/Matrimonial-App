import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { socket } from "../socket"; // ✅ import socket

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ On app start, check token & load user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/users/currentUser")
        .then((res) => {
          setUser(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Connect socket once user is set
  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
      console.log("🟢 Connected to socket with user ID:", user._id);
    }

    return () => {
      socket.disconnect();
      console.log("🔴 Disconnected from socket");
    };
  }, [user]);

  const login = (token) => {
    localStorage.setItem("token", token);
    API.get("/users/currentUser").then((res) => {
      setUser(res.data.data);
      navigate("/");
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    socket.disconnect(); // ✅ disconnect on logout
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
