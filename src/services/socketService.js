import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = {};
  }

  // Initialize socket connection
  connect(serverURL = 'http://localhost:5000') {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverURL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected:', this.socket.id);
          this.isConnected = true;
          this.emit('connected');
          resolve(this.socket.id);
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Socket disconnected');
          this.isConnected = false;
          this.emit('disconnected');
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
          this.emit('error', error);
          reject(error);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          this.emit('connection_error', error);
        });
      } catch (error) {
        console.error('Socket connection error:', error);
        reject(error);
      }
    });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Register admin
  registerAdmin(adminId) {
    if (this.socket) {
      this.socket.emit('admin_register', { adminId });
      console.log('Admin registered:', adminId);
    }
  }

  // Load chat history
  loadChatHistory(chatId, callback) {
    if (this.socket) {
      this.socket.emit('load_chat_history', { chatId });
      this.socket.once('chat_history', (data) => {
        console.log('Chat history loaded:', data);
        callback(data);
      });
    }
  }

  // Load all active chats
  loadActiveChats(callback) {
    if (this.socket) {
      this.socket.emit('load_active_chats');
      this.socket.once('active_chats', (data) => {
        console.log('Active chats loaded:', data);
        callback(data);
      });
    }
  }

  // Send message
  sendMessage(chatId, message, sender = 'admin') {
    if (this.socket) {
      const messageData = {
        chatId,
        message,
        sender,
        timestamp: new Date().toISOString(),
      };
      this.socket.emit('send_message', messageData);
      console.log('Message sent:', messageData);
    }
  }

  // Listen for incoming messages
  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('message_received', (data) => {
        console.log('Message received:', data);
        callback(data);
      });
    }
  }

  // Listen for chat list updates
  onChatListUpdated(callback) {
    if (this.socket) {
      this.socket.on('chat_list_updated', (data) => {
        console.log('Chat list updated:', data);
        callback(data);
      });
    }
  }

  // Listen for typing indicator
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', (data) => {
        callback(data);
      });
    }
  }

  // Send typing indicator
  sendTypingIndicator(chatId, isTyping = true) {
    if (this.socket) {
      this.socket.emit('typing_indicator', { chatId, isTyping });
    }
  }

  // Mark message as read
  markAsRead(chatId) {
    if (this.socket) {
      this.socket.emit('mark_as_read', { chatId });
    }
  }

  // Listen for status changes
  onStatusChanged(callback) {
    if (this.socket) {
      this.socket.on('status_changed', (data) => {
        console.log('Status changed:', data);
        callback(data);
      });
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      console.log(`Listening to event: ${event}`);
    }
  }

  // Emit event
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null,
    };
  }
}

export default new SocketService();
