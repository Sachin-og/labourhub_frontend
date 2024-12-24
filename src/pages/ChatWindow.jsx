import React, { useEffect, useState } from "react";
import { fetchMessages, sendMessage, getUserById } from "../api/axios"; // Adjust the path
import "./ChatWindow.css"; // Optional: Ensure CSS file exists for styling

const ChatWindow = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(null); // Store receiver's details
  const senderId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (receiverId) {
      // Fetch the receiver's details (name and profile picture)
      getUserById(receiverId).then((user) => {
        setReceiver(user); // Store the receiver's details
      });

      // Fetch the messages between sender and receiver
      fetchMessages(senderId, receiverId).then((msgs) => {
        setMessages(msgs);
      });
    }
  }, [receiverId, senderId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const message = {
        sender_id: senderId,
        receiver_id: receiverId,
        content: newMessage,
      };
      const sentMessage = await sendMessage(message);
      setMessages((prev) => [...prev, sentMessage]);
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
