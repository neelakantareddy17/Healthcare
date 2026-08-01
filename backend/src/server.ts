import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';
import { initSocket } from './socket/index.js';

const httpServer = http.createServer(app);

initSocket(httpServer);

const start = async () => {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('✅ Connected to PostgreSQL database');

    httpServer.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Healthcare API running on http://localhost:${env.port}`);
      // eslint-disable-next-line no-console
      console.log(`🔌 Socket.IO listening on the same port`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
