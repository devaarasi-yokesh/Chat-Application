import express, { Request, Response } from 'express';
import next from 'next';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const wss = new WebSocket('ws://localhost:3000');

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ message: 'Hello from WebSocket server!' }));

    ws.on('message', (message: string) => {
      console.log('Received message:', message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);  // Process normal HTTP requests via Next.js
  });

  // Get the underlying HTTP server and set up the upgrade handler
  const httpServer = http.createServer(server);

  // Handle WebSocket upgrade requests
  httpServer.on('upgrade', (req, socket, head) => {
    if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req); // Emit the WebSocket connection event
      });
    } else {
      // If it's not a WebSocket upgrade request, proceed with regular HTTP handling
      socket.destroy();
    }
  });

  // Start the HTTP server
  httpServer.listen(3000, () => {
    
    console.log('> Ready on http://localhost:3000');
  });
});
