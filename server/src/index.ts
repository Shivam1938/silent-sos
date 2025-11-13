import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { networkInterfaces } from 'os';
import app from './app.js';
import { initEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { registerSosNamespace } from './services/realtime.js';

const env = initEnv();
const port = env.PORT || 4000;
const httpServer = createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: env.CLIENT_BASE_URL === '*' ? '*' : env.CLIENT_BASE_URL.split(','),
    methods: ['GET', 'POST'],
  },
});

registerSosNamespace(io);

// Helper function to get local IP address
const getLocalIP = (): string | null => {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue;
    for (const net of nets) {
      // Skip internal (127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
};

connectDatabase(env.MONGODB_URI)
  .then(() => {
    const host = '0.0.0.0'; // Listen on all interfaces
    httpServer.listen(port, host, () => {
      const localIP = getLocalIP();
      console.log(`⚡ Silent SOS server running on port ${port}`);
      console.log(`🌐 Server accessible at:`);
      console.log(`   - http://localhost:${port} (local)`);
      if (localIP) {
        console.log(`   - http://${localIP}:${port} (network)`);
      }
      if (env.NODE_ENV === 'development') {
        console.log(`\n📱 For physical device, set EXPO_PUBLIC_API_URL in mobile/.env:`);
        console.log(`   EXPO_PUBLIC_API_URL=http://${localIP || 'YOUR_IP'}:${port}\n`);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

