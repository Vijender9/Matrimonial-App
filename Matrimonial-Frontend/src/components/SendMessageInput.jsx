import axios from 'axios';
import React, { useState, useRef } from 'react';
import { socket } from '../socket';
import API from '../api/axiosInstance.jsx';

const SendMessageInput = ({ receiverId, onSend, onTyping }) => {
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const typingTimeoutRef = useRef(null);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const res = await API.post(
        `/messages/send/${receiverId}`,
      { content },
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      const newMsg = res.data.data;
      // onSend(newMsg);
      // emit to socket (send to self+ receiver)
      socket.emit("send-message", {
        to: receiverId,
        message: newMsg,
      });

      setContent("");
      socket.emit("stop-typing",{to:receiverId});
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  const handleTyping = (e) => {
    setContent(e.target.value);

    socket.emit("typing", { to: receiverId });
    // if (onTyping) onTyping(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Emit stop-typing after 1.5 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { to: receiverId });
      // if (onTyping) onTyping(false);
    }, 1500);
  };

  return (
    <div className="mt-2 flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="border rounded w-full px-3 py-2"
        value={content}
        onChange={handleTyping}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="bg-blue-500 text-black px-4 py-2 rounded"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default SendMessageInput;
