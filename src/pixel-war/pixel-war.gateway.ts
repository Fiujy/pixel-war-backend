import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class PixelGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    private pixels: Record<string, { x: number; y: number; color: string }> = {};
    private users: Record<string, string> = {};
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      client.emit('init', this.pixels);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      delete this.users[client.id];
    }
  
    @SubscribeMessage('draw')
    handleDraw(client: Socket, payload: { x: number; y: number; color: string }) {
      const id = `${payload.x},${payload.y}`;
      this.pixels[id] = payload;
      this.server.emit('draw', payload);
    }
  
    @SubscribeMessage('erase')
    handleErase(client: Socket, payload: { x: number; y: number }) {
      const id = `${payload.x},${payload.y}`;
      delete this.pixels[id];
      this.server.emit('erase', payload);
    }
  
    @SubscribeMessage('set-username')
    handleSetUsername(client: Socket, username: string) {
      this.users[client.id] = username;
      console.log(`User set username: ${username}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, message: string) {
      const username = this.users[client.id] || 'Anonymous';
      this.server.emit('chat', { username, message });
    }
  }
  