import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import './ChatScreen.css'; // CSS for styling

const ChatScreen = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const currentUserId = sessionStorage.getItem('userId');

  const handleUserSelection = (userId) => {
    setSelectedUserId(userId);  // This should properly update the selectedUserId
  };

  return (
    <div className="chat-screen">
      {/* Sidebar */}
      <div className="chat-sidebar-container">
        <ChatSidebar
          currentUserId={currentUserId}
          onSelectChat={handleUserSelection}
        />
      </div>

      {/* Chat Window */}
      <div className="chat-window-container">
        {selectedUserId ? (
          <ChatWindow receiverId={selectedUserId} />  
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
