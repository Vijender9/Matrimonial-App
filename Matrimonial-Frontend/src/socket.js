// src/socket.js
import { io } from "socket.io-client";

export const socket = io("https://matrimonial-app-m0oi.onrender.com", {
  withCredentials: true,
});
