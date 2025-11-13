import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import app from './app.js';
import { initEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { registerSosNamespace } from './services/realtime.js';

const env = initEnv();
const port = env.PORT || 4000;
const httpServer = createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: env.CLIENT_BASE_URL,
    methods: ['GET', 'POST'],
  },
});

registerSosNamespace(io);

connectDatabase(env.MONGODB_URI)
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`⚡ Silent SOS server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

