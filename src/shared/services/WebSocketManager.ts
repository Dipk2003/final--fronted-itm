import EventEmitter from 'events';

interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

interface WebSocketMessage {
  type: string;
  payload: any;
}

export class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...config
    };
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventListeners();
      this.startHeartbeat();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleConnectionError();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.emit('disconnected');
      this.stopHeartbeat();
      
      if (!this.isIntentionallyClosed) {
        this.handleConnectionError();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'heartbeat') {
          this.handleHeartbeat();
        } else {
          this.emit('message', message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private handleConnectionError(): void {
    if (this.reconnectAttempts < (this.config.maxReconnectAttempts || 5)) {
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.reconnectAttempts++;
        this.connect();
      }, this.config.reconnectInterval);
    } else {
      this.emit('maxReconnectAttemptsReached');
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private sendHeartbeat(): void {
    this.send({ type: 'heartbeat', payload: { timestamp: Date.now() } });
  }

  private handleHeartbeat(): void {
    this.emit('heartbeat');
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
      this.emit('error', new Error('WebSocket is not connected'));
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
    }
  }

  // Utility method to check connection status
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // Utility method to get current connection state
  getState(): number {
    return this.ws ? this.ws.readyState : -1;
  }
}

// Example usage:
/*
const wsManager = new WebSocketManager({
  url: 'ws://your-websocket-server',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000
});

wsManager.on('connected', () => {
  console.log('Connected to WebSocket');
});

wsManager.on('message', (message) => {
  console.log('Received message:', message);
});

wsManager.on('error', (error) => {
  console.error('WebSocket error:', error);
});

wsManager.connect();

// When component unmounts:
wsManager.disconnect();
*/

export default WebSocketManager;
