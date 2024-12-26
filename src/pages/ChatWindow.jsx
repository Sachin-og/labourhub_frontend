import React, { useEffect, useState } from "react";
import { fetchMessages, getUserById } from "../api/axios";
import { io } from "socket.io-client";
import "./ChatWindow.css";

const ChatWindow = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const senderId = sessionStorage.getItem("userId");
  const socket = io("http://localhost:5000"); // Make sure to connect to the right server

  useEffect(() => {
    if (receiverId) {
      getUserById(receiverId).then((user) => setReceiver(user));
      fetchMessages(senderId, receiverId).then((msgs) => setMessages(msgs));
    }

    socket.on("receive_message", (message) => {
      if (message.receiver_id === senderId || message.sender_id === senderId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => socket.disconnect();
  }, [receiverId, senderId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const message = { sender_id: senderId, receiver_id: receiverId, content: newMessage };
      socket.emit("send_message", message);
      setMessages((prev) => [...prev, { ...message, id: Date.now() }]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-window">
      {receiverId ? (
        <>
          <header className="chat-header">
            <div className="chat-header-left">
              <img
                src={receiver?.profilePicture || '/default-avatar.png'}
                alt={receiver?.name || 'User'}
                className="chat-avatar"
              />
              <h2>{receiver?.name || "User"}</h2>
            </div>
          </header>
          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender_id === senderId ? "sent" : "received"}`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">Select a user to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
