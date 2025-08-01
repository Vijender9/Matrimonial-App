// src/pages/RecentChats.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMessageTime } from '../utils/formatMessageTime';
import { socket } from '../socket';

const RecentChats = () => {
  const [chats, setChats] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const navigate = useNavigate();
  const myUserId = localStorage.getItem("userId");

  // Fetch initial chats
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/messages/recentMessages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedChats = [...(res.data.data || [])].sort(
          (a, b) => new Date(b.lastMessage.created) - new Date(a.lastMessage.created)
        );

        setChats(sortedChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setChats([]);
      }
    };

    fetchChats();
  }, []);

  // Typing indicator logic
  useEffect(() => {
    const handleTyping = ({ from }) => {
      setTypingUsers((prev) => ({ ...prev, [from]: true }));

      // Optional auto-clear
      setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [from]: false }));
      }, 5000);
    };

    const handleStopTyping = ({ from }) => {
      setTypingUsers((prev) => ({ ...prev, [from]: false }));
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, []);

  // 🟢 Real-time update when new message is received
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      const userId = msg.sender === myUserId ? msg.receiver : msg.sender;

      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex((chat) => chat.user._id === userId);

        if (chatIndex !== -1) {
          // Update existing chat's lastMessage
          const updatedChat = { ...updatedChats[chatIndex] };
          updatedChat.lastMessage = msg;

           // ✅ If the sender is NOT me → increment unread count
          if (msg.sender !== myUserId) {
            updatedChat.unreadCount = (updatedChat.unreadCount || 0) + 1;
          }

          // Move to top
          updatedChats.splice(chatIndex, 1);
          return [updatedChat, ...updatedChats];
         }else {
          // 🔁 Optionally fetch user info if new
          return [
            {
              user: { _id: userId, name: "New User", profilePic: "" },
              lastMessage: msg,
              unreadCount:  msg.sender !== myUserId ? 1 : 0,
            },
            ...updatedChats,
          ];
        }
      });
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [myUserId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📨 Your Chats</h2>

      {chats.length === 0 ? (
        <p className="text-center text-gray-500">No recent chats found.</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.user._id}
            className="relative p-3 border rounded mb-2 cursor-pointer hover:bg-gray-100 transition"
            onClick={() =>
              navigate(`/chat/${chat.user._id}`, {
                state: {
                  name: chat.user.name,
                  profilePic: chat.user.profilePic,
                },
              })
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <img
                  src={chat.user.profilePic || "/default.jpg"}
                  alt="dp"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{chat.user.name}</h4>
                  <p className="text-sm text-gray-600 italic">
                    {
                      typingUsers[chat.user._id]
                        ? `${chat.user.name} is typing...`
                        : (chat.lastMessage?.content?.slice(0, 40) || "Start chatting...")
                    }
                  </p>
                </div>
              </div>

              {/* Show message time */}
              <div className="text-xs text-gray-400">
                {!typingUsers[chat.user._id] &&
                  chat.lastMessage?.created &&
                  formatMessageTime(chat.lastMessage.created)
                }
              </div>
            </div>

            {/* 🔴 Unread badge */}
            {chat.unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RecentChats;
