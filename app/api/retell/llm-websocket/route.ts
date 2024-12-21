import { Server } from 'socket.io';
import { createServer } from 'http';
import { NextApiResponse } from 'next';

// Create HTTP server instance
const httpServer = createServer();

// Create Socket.IO instance
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_SITE_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('[Socket.IO] Client connected');

  // Send initial config
  const config: CustomLlmResponse = {
    response_type: "config",
    config: {
      auto_reconnect: true,
      call_details: true,
    },
  };
  socket.emit('message', config);

  socket.on('message', async (data: string) => {
    try {
      const message = JSON.parse(data) as CustomLlmRequest;
      console.log('[Socket.IO] Received message:', message);

      if (message.request_type === 'transcription' && message.transcription?.is_final) {
        console.log('[Socket.IO] Processing final transcription:', message.transcription.text);
        
        try {
          // Process transcription with Retell AI instead
          try {
            // TODO: Implement Retell AI processing here
            // For now, just echo back the transcription
            const aiResponse = message.transcription.text;
            
            // Send response back through WebSocket
            const llmResponse: CustomLlmResponse = {
              response_type: 'llm_response',
              response: {
                content: aiResponse
              }
            };
            socket.emit('message', llmResponse);
          } catch (error) {
            console.error('[Retell AI] Error:', error);
            socket.emit('message', {
              response_type: 'error',
              error: 'Failed to generate AI response'
            });
          }
        } catch (error) {
          console.error('[Socket.IO] Error processing message:', error);
          socket.emit('message', {
            response_type: 'error',
            error: 'Failed to process message'
          });
        }
      }
    } catch (error) {
      console.error('[Socket.IO] Error processing message:', error);
      socket.emit('message', {
        response_type: 'error',
        error: 'Failed to process message'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('[Socket.IO] Client disconnected');
  });
});

// Start the server
const PORT = parseInt(process.env.WEBSOCKET_PORT || '3001', 10);
httpServer.listen(PORT, () => {
  console.log(`[Socket.IO] Server running on port ${PORT}`);
});

interface CustomLlmRequest {
  request_type: string;
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

interface CustomLlmResponse {
  response_type: string;
  config?: {
    auto_reconnect: boolean;
    call_details: boolean;
  };
  response?: {
    content: string;
  };
}

export const dynamic = 'force-dynamic';

export async function GET(req: Request, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ status: 'WebSocket server running' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
