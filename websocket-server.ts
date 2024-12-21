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

// Create HTTP server instance
const httpServer = createServer();

// Create Socket.IO instance with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean),
    methods: ['GET', 'POST']
  }
});

// Initialize Retell client
const retellClient = new Retell({
  apiKey: process.env.NEXT_PUBLIC_RETELL_API_KEY
});

io.on('connection', (socket: any) => {
  console.log('[Socket.IO] Client connected');

  // Send initial config
  socket.emit('message', {
    response_type: 'config',
    config: {
      auto_reconnect: true,
      call_details: true
    }
  });

  socket.on('message', async (message: TranscriptionMessage) => {
    try {
      console.log('[Socket.IO] Received message:', message);

      if (message.transcription) {
        console.log('[Socket.IO] Processing transcription:', message.transcription.text);

        // Forward the transcription to the client
        socket.emit('message', {
          transcription: {
            text: message.transcription.text,
            is_final: message.transcription.is_final
          }
        });

        // If it's a final transcription, send an AI response
        if (message.transcription.is_final) {
          socket.emit('message', {
            response: {
              content: `AI Response: ${message.transcription.text}`
            }
          });
        }
      }
    } catch (error) {
      console.error('[Socket.IO] Error processing message:', error);
      socket.emit('error', {
        message: 'Error processing message'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('[Socket.IO] Client disconnected');
  });
});

const PORT = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`[Socket.IO] Server running on port ${PORT}`);
});
