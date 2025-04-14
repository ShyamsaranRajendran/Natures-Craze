import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const backendURL = process.env.REACT_APP_BACKEND_URL;
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Nature's Carze assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputMessage('');

    try {
       const response = await axios.post(`${backendURL}/chat/chat`, {
        message: inputMessage,
        history: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      });

      // Add bot response
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble connecting. Please try again later.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
<div className={`fixed right-5 z-50 ${isOpen ? 'w-80' : ''} bottom-20 sm:bottom-5`}>
{isOpen ? (
        <div className="bg-white rounded-lg shadow-xl flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Nature's Carze Assistant</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-green-600 text-white ml-auto rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 mr-auto rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button 
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-r-full hover:bg-green-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBot;