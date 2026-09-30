import React, { useState, useEffect } from 'react';
import { ChevronDown, MessageCircle, Search, Send, X, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import socketService from '../../services/socketService';

const DEFAULT_CHATS = [];

const SupportChats = () => {
  const [timeFilter, setTimeFilter] = useState('All Chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  const [chats, setChats] = useState([]);

  // Initialize Socket connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Connect to socket server
        await socketService.connect('http://localhost:5000', 'admin-001');
        setIsConnected(true);
        setConnectionError(null);
        console.log('✅ Admin connected to socket server');

        // Register admin
        socketService.registerAdmin('admin-001');

        // Load active chats
        socketService.loadActiveChats((activeCats) => {
          if (activeCats && activeCats.length > 0) {
            setChats(activeCats);
          }
        });

        // Listen for new messages
        socketService.onMessageReceived((data) => {
          console.log('New message received:', data);
          setChats(prev => prev.map(chat =>
            chat.id === data.chatId
              ? {
                  ...chat,
                  messages: [...(chat.messages || []), {
                    id: (chat.messages?.length || 0) + 1,
                    sender: data.sender,
                    text: data.message,
                    timestamp: new Date(data.timestamp),
                  }],
                  lastMessage: data.message,
                  timestamp: new Date(data.timestamp),
                  unreadCount: data.sender !== 'admin' ? (chat.unreadCount || 0) + 1 : chat.unreadCount,
                }
              : chat
          ));

          // Update selected chat if it's open
          if (selectedChat && selectedChat.id === data.chatId) {
            setSelectedChat(prev => ({
              ...prev,
              messages: [...(prev.messages || []), {
                id: (prev.messages?.length || 0) + 1,
                sender: data.sender,
                text: data.message,
                timestamp: new Date(data.timestamp),
              }],
            }));
          }
        });

        // Listen for chat list updates
        socketService.onChatListUpdated((updatedChats) => {
          console.log('Chat list updated:', updatedChats);
          setChats(updatedChats);
        });

        // Listen for connection errors
        socketService.on('error', (error) => {
          console.error('Socket error:', error);
          setConnectionError(error.message || 'Connection error occurred');
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        setConnectionError('Failed to connect to chat server');
        setIsConnected(false);
      }
    };

    initializeSocket();

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, []);

  const filteredChats = chats.filter(chat => {
    const name = chat.captainName || chat.customerName;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !isConnected) return;

    const messageText = messageInput.trim();
    setLoading(true);

    try {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        sender: 'admin',
        text: messageText,
        timestamp: new Date(),
      };

      setChats(prev => prev.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: messageText }
          : chat
      ));

      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: messageText,
      }));

      setMessageInput('');

      // Send via socket
      socketService.sendMessage(selectedChat.id, messageText, 'admin');
      console.log('Message sent via socket:', { chatId: selectedChat.id, message: messageText });

      // Mark as read
      socketService.markAsRead(selectedChat.id);

    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError('Failed to send message. Please try again.');

      // Revert the optimistic update
      setChats(prev => prev.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: chat.messages.slice(0, -1) }
          : chat
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-600 bg-green-100 text-green-700"><span className="w-2 h-2 rounded-full bg-green-600"></span>Active</span>;
    }
    return <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-600 bg-gray-100 text-gray-600"><span className="w-2 h-2 rounded-full bg-gray-400"></span>Inactive</span>;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div>
      {/* Connection Status Alert */}
      {connectionError && (
        <div style={{
          background: '#FEE2E2',
          border: '1px solid #FECACA',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#DC2626',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          <AlertCircle size={18} />
          {connectionError}
        </div>
      )}

      {!isConnected && (
        <div style={{
          background: '#FEF3C7',
          border: '1px solid #FCD34D',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#B45309',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          <WifiOff size={18} />
          Reconnecting to chat server...
        </div>
      )}

      {isConnected && !connectionError && (
        <div style={{
          background: '#E0FFF0',
          border: '1px solid #A7F3D0',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#047857',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          <Wifi size={18} />
          Connected to chat server
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
      {/* Chats List */}
      <div style={{
        flex: selectedChat ? '0 0 350px' : '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'flex 0.3s ease',
      }}>
        {/* Header and Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Support Chats
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Manage captain and customer support conversations
            </p>
          </div>
        </div>

        {/* Time Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-color)',
          padding: '6px 12px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          width: 'fit-content',
        }}>
          <Clock size={15} color="#FF6347" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <option value="All Chats">All Chats</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Unread">Unread Only</option>
          </select>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              padding: '10px 12px 10px 40px',
              borderRadius: '10px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        {/* Chats List */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {filteredChats.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <MessageCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No chats found</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    padding: '14px 16px',
                    borderBottomWidth: '1px',
                    borderBottomColor: 'var(--border-color)',
                    cursor: 'pointer',
                    backgroundColor: selectedChat?.id === chat.id ? 'var(--bg-input)' : 'transparent',
                    transition: 'background-color 0.2s',
                    ':hover': { backgroundColor: 'var(--bg-input)' }
                  }}
                  onMouseEnter={(e) => !selectedChat && (e.currentTarget.style.backgroundColor = 'var(--bg-input)')}
                  onMouseLeave={(e) => !selectedChat && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: chat.type === 'captain' ? '#FF6347' : '#6366F1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontWeight: '700',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}>
                      {(chat.captainName || chat.customerName)[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {chat.captainName || chat.customerName}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {chat.type === 'captain' ? '(Captain)' : '(Customer)'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span style={{
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '10px',
                            background: '#FF6347',
                            color: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700',
                            flexShrink: 0,
                          }}>
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {formatTime(chat.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Detail */}
      {selectedChat && (
        <div className="glass-card" style={{
          flex: '1 1 500px',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          minHeight: '600px',
        }}>
          {/* Chat Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: selectedChat.type === 'captain' ? '#FF6347' : '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontWeight: '700',
                fontSize: '16px',
              }}>
                {(selectedChat.captainName || selectedChat.customerName)[0]}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedChat.captainName || selectedChat.customerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  {getStatusBadge(selectedChat.status)}
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {selectedChat.messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                  gap: '8px',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: msg.sender === 'admin' ? '#FF6347' : '#F1F5F9',
                  color: msg.sender === 'admin' ? '#FFF' : 'var(--text-primary)',
                }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', lineHeight: '1.4' }}>
                    {msg.text}
                  </p>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '11px',
                    opacity: 0.7,
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            padding: '12px 16px',
            borderTopWidth: '1px',
            borderTopColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-input)',
          }}>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none',
                maxHeight: '80px',
                fontFamily: 'inherit',
              }}
              rows={1}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || loading}
              style={{
                background: messageInput.trim() && !loading ? '#FF6347' : '#E5E7EB',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: messageInput.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SupportChats;
