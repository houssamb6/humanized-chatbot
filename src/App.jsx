import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Trash2, ChevronDown, 
  Image, Paperclip, Smile, Mic, X, MoreVertical,
  Moon, Sun, Settings, Bell, Info, FileText, Download,
  RefreshCw, Zap, ArrowUp, AlertTriangle
} from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hey there! 👋 I'm your AI companion powered by Llama2. What's on your mind today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [apiStatus, setApiStatus] = useState('available'); // 'available', 'unavailable', 'error'
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Sample emoji list
  const emojis = ["😊", "👍", "🎉", "❤️", "😂", "🤔", "👋", "🔥", "✨", "🙏", "👏", "🌟"];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  // Check if API is available on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      // Just a simple check to see if we can reach the server
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: 'ping' }),
      });
      
      if (response.ok) {
        setApiStatus('available');
      } else {
        setApiStatus('unavailable');
      }
    } catch (error) {
      console.error('API check failed:', error);
      setApiStatus('unavailable');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    try {
      // Format conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add the current message
      conversationHistory.push({
        role: 'user',
        content: inputMessage
      });

      // API call to the Flask backend with full conversation
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: inputMessage,
          conversation_history: conversationHistory 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setApiStatus('available');
    } catch (error) {
      console.error('Error calling API:', error);
      
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my brain right now. Please check if the backend server is running or try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
      setApiStatus('error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hey there! 👋 I'm your AI companion powered by Llama2. What's on your mind today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setShowOptions(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setShowOptions(false);
  };

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border transition-all ${isDarkMode ? 'bg-gray-800 border-purple-500/20' : 'bg-white border-purple-300/30'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Llama2 Assistant</h1>
                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${apiStatus === 'available' ? 'bg-green-400' : apiStatus === 'unavailable' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                  <p className="text-xs text-purple-100">
                    {apiStatus === 'available' ? 'Online' : apiStatus === 'unavailable' ? 'Offline' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                onClick={() => setShowOptions(!showOptions)}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          
          {/* Dropdown menu */}
          {showOptions && (
            <div className={`absolute right-4 top-16 rounded-xl shadow-lg z-10 p-2 w-48 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <button 
                onClick={toggleTheme}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${isDarkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button 
                onClick={handleClearChat}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${isDarkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <Trash2 size={16} />
                <span>Clear Chat</span>
              </button>
              <button 
                onClick={checkApiStatus}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${isDarkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <RefreshCw size={16} />
                <span>Check Connection</span>
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${isDarkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* API Status alert */}
        {apiStatus === 'unavailable' && (
          <div className={`p-2 flex items-center justify-between ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} />
              <span className="text-sm">Backend server is not responding. Make sure your Flask server is running.</span>
            </div>
            <button 
              onClick={checkApiStatus}
              className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'}`}
            >
              Retry
            </button>
          </div>
        )}

        {/* Chat area */}
        <div className="flex flex-col h-[500px]">
          <div 
            ref={chatContainerRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-3">
                <div className="text-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                    {date}
                  </span>
                </div>
                
                {dateMessages.map((message, i) => {
                  const showAvatar = i === 0 || dateMessages[i-1].sender !== message.sender;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${i > 0 && dateMessages[i-1].sender === message.sender ? 'mt-1' : 'mt-3'}`}
                    >
                      <div
                        className={`flex items-end space-x-2 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        {showAvatar ? (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                                : message.isError 
                                  ? 'bg-gradient-to-br from-red-500 to-orange-500'
                                  : 'bg-gradient-to-br from-pink-500 to-purple-500'
                            }`}
                          >
                            {message.sender === 'user' ? (
                              <User size={14} className="text-white" />
                            ) : message.isError ? (
                              <AlertTriangle size={14} className="text-white" />
                            ) : (
                              <Bot size={14} className="text-white" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 flex-shrink-0"></div>
                        )}
                        <div 
                          className={`${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none'
                                : message.isError
                                  ? (isDarkMode ? 'bg-red-900/50 text-red-200 rounded-bl-none' : 'bg-red-100 text-red-800 rounded-bl-none') 
                                  : isDarkMode
                                    ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                            } shadow-sm`}
                          >
                            {message.text}
                          </div>
                          <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-2 mt-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className={`rounded-2xl px-4 py-2 rounded-bl-none ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800 border border-gray-200'} shadow-sm`}>
                  <div className="flex space-x-1 h-4 items-center">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message bar */}
          <div className={`border-t p-3 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="relative">
              {/* Emoji picker */}
              {showEmojis && (
                <div className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg grid grid-cols-6 gap-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                  {emojis.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-xl hover:bg-gray-200 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                  <button 
                    className={`absolute top-1 right-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} p-1`}
                    onClick={() => setShowEmojis(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <div className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setShowEmojis(!showEmojis)}
                    className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} ${showEmojis ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} transition-colors`}
                  >
                    <Smile size={18} />
                  </button>
                </div>
                
                <div className={`flex-1 flex items-center rounded-xl overflow-hidden transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
                }`}>
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className={`flex-1 px-4 py-3 focus:outline-none transition-colors resize-none max-h-32 ${
                      isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                    } overflow-auto`}
                    style={{ height: 'auto' }}
                    disabled={apiStatus === 'unavailable'}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || apiStatus === 'unavailable' || isTyping}
                  className={`rounded-full w-10 h-10 flex items-center justify-center transition-all ${
                    inputMessage.trim() && apiStatus !== 'unavailable' && !isTyping
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90' 
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <Send size={18} className={inputMessage.trim() && apiStatus !== 'unavailable' && !isTyping ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                </button>
              </div>
              
              <div className={`flex justify-between mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <span>Powered by Flask + LangChain + Ollama</span>
                <span>{apiStatus === 'unavailable' ? 'Backend offline' : 'Ready to chat'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom actions bar */}
        <div className={`p-3 transition-colors flex justify-center border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex space-x-4">
            <button 
              onClick={handleClearChat}
              className={`flex items-center space-x-1 ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} transition-colors`}
            >
              <RefreshCw size={14} />
              <span className="text-sm">New Chat</span>
            </button>
            <button className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'} transition-colors`}>
              <FileText size={14} />
              <span className="text-sm">Save Chat</span>
            </button>
            <button 
              onClick={checkApiStatus}
              className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'} transition-colors`}
            >
              <Zap size={14} />
              <span className="text-sm">Check API</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;