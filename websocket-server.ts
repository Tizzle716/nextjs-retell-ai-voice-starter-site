const { Server } = require('socket.io');
const { createServer } = require('http');
const Retell = require('retell-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

interface TranscriptionMessage {
  transcription?: {
    text: string;
    is_final: boolean;
  };
  call_details?: {
    call_id: string;
    agent_id: string;
    customer_phone_number: string;
  };
}

interface RetellClient {
  call: {
    update: (callId: string, data: { status: string; transcript: string }) => Promise<void>;
  };
}

// Create HTTP server instance
const httpServer = createServer();

// Create Socket.IO instance with production-ready configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean)
      : ['http://localhost:3000', process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  path: '/ws'
});

// Initialize Retell client with error handling
let retellClient: RetellClient;
try {
  retellClient = new Retell({
    apiKey: process.env.NEXT_PUBLIC_RETELL_API_KEY
  });
} catch (error) {
  console.error('[Retell] Failed to initialize Retell client:', error);
  process.exit(1);
}

// Track active connections
const activeConnections = new Map();

io.on('connection', (socket: any) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  activeConnections.set(socket.id, new Date());

  // Send initial config
  socket.emit('message', {
    response_type: 'config',
    config: {
      auto_reconnect: true,
      call_details: true,
      ping_interval: 25000
    }
  });

  socket.on('message', async (message: TranscriptionMessage) => {
    try {
      console.log(`[Socket.IO] Received message from ${socket.id}:`, message);

      if (message.transcription) {
        // Validate transcription data
        if (typeof message.transcription.text !== 'string') {
          throw new Error('Invalid transcription format');
        }

        console.log(`[Socket.IO] Processing transcription for ${socket.id}:`, message.transcription.text);

        // Forward the transcription to the client
        socket.emit('message', {
          transcription: {
            text: message.transcription.text,
            is_final: message.transcription.is_final
          }
        });

        // If it's a final transcription, process with Retell
        if (message.transcription.is_final && message.call_details?.call_id) {
          try {
            // Update call status in Retell
            await retellClient.call.update(message.call_details.call_id, {
              status: 'completed',
              transcript: message.transcription.text
            });

            socket.emit('message', {
              response: {
                content: `AI Response: ${message.transcription.text}`,
                call_id: message.call_details.call_id
              }
            });
          } catch (error) {
            console.error(`[Retell] Error updating call ${message.call_details.call_id}:`, error);
            socket.emit('error', {
              message: 'Failed to process transcription',
              call_id: message.call_details.call_id
            });
          }
        }
      }
    } catch (error) {
      console.error(`[Socket.IO] Error processing message from ${socket.id}:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Error processing message'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    activeConnections.delete(socket.id);
  });

  // Handle errors
  socket.on('error', (error: Error) => {
    console.error(`[Socket.IO] Socket error for ${socket.id}:`, error);
    socket.emit('error', {
      message: 'Internal server error'
    });
  });
});

// Health check endpoint
httpServer.on('request', (req: any, res: any) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      connections: activeConnections.size,
      uptime: process.uptime()
    }));
  }
});

const PORT = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`[Socket.IO] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Socket.IO] SIGTERM received. Closing server...');
  httpServer.close(() => {
    console.log('[Socket.IO] Server closed');
    process.exit(0);
  });
});
