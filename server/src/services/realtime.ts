import type { Server } from 'socket.io';
import { SosEventModel } from '../models/SosEvent.js';

export const registerSosNamespace = (io: Server) => {
  const namespace = io.of('/sos');

  namespace.on('connection', (socket) => {
    socket.on('join-event', async (eventId: string) => {
      socket.join(eventId);
      const event = await SosEventModel.findById(eventId).lean();
      if (event) {
        socket.emit('event:state', event);
      }
    });
  });
};

