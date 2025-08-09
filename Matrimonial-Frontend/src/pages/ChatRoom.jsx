import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SendMessageInput from '../components/SendMessageInput.jsx';
import { formatMessageTime, formatDateGroup } from '../utils/formatMessageTime.js';
import { socket } from '../socket';

const ChatRoom = () => {
  const { userId } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const myUserId =localStorage.getItem("userId");

  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(location.state || null);
  const [isTyping, setIsTyping] = useState(false);

  // Join socket room
  useEffect(() => {
   
  // joining my own room
    socket.emit("join", myUserId); // join here with own userid not rceeiver's
  }, []);

  // Fetch chat messages
  useEffect(() => {
    axios
      .get(`http://localhost:1000/api/messages/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setMessages(res.data?.data || []))
      .catch(err => {
        console.log("Fetch messages error", err);
        setMessages([]);
      });
  }, [userId]);

  // Fetch user info
  useEffect(() => {
    if (!chatUser) {
      axios.get(`http://localhost:1000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setChatUser(res.data?.data))
        .catch(err => console.log("Error fetching user:", err));
    }
  }, [userId, chatUser]);

  // Scroll to latest message
  useEffect(() => {
    const container = document.querySelector(".chat-scroll");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, isTyping]);

  // Mark messages as read
  useEffect(() => {
    axios.patch(
      `http://localhost:1000/api/messages/markAsRead/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(err => console.log("Mark read failed", err));
  }, [userId]);

  // Receive message in real-time
  useEffect(() => {
    const handleReceiveMessage = (newMsg) => {
      if (newMsg.sender === userId || newMsg.receiver === userId) {

        console.log("received message via soket :vz",newMsg);
        setMessages(prev => [...prev, newMsg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [userId]);

  // Typing indicator handlers
  useEffect(() => {
    const handleTyping = ({ from }) => {
      if (from === userId) setIsTyping(true);
    };

    const handleStopTyping = ({ from }) => {
      if (from === userId) setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [userId]);

  // Send message
  const handleSend = (newMsg) => {
    // setMessages(prev => [...prev, newMsg]);
    socket.emit("send-message", { to: userId, message: newMsg });
  };

  // Group by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.created || msg.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 shadow bg-white border-b">
        <img
          src={chatUser?.profilePic || "/default.jpg"}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-bold">{chatUser?.name || "User"}</h2>
          <p className="text-sm text-gray-500">{chatUser?.profession || ""}</p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 chat-scroll">
        {Object.entries(groupedMessages).map(([dateStr, msgs]) => (
          <div key={dateStr}>
            <div className="text-center text-gray-500 text-sm my-4 font-medium">
              {formatDateGroup(dateStr)}
            </div>

            {msgs.map(msg => (
              <div
                key={msg._id}
                className={`max-w-xs p-2 px-4 my-2 text-sm rounded-xl shadow-sm ${
                  (msg.sender === userId || msg.sender?._id === userId)
                    ? "ml-auto bg-blue-100 text-right"
                    : "mr-auto bg-white border"
                }`}
              >
                <div>{msg.content}</div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {formatMessageTime(msg.created || msg.createdAt)}
                </p>
              </div>
            ))}
          </div>
        ))}

        {isTyping && (
          <div className="text-sm italic text-gray-500 mt-2">Typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <SendMessageInput
          receiverId={userId}
          onSend={handleSend}
          // onTyping={setIsTyping}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
