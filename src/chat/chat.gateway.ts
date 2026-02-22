import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { roomId: string }) {
    client.join(data.roomId);
    console.log(`Client ${client.id} joined room ${data.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { 
      sender?: string; 
      guestName?: string; 
      guestEmail?: string; 
      content: string;
      type?: string;
      imageUrl?: string;
      recipient?: string;
      recipientEmail?: string;
    },
  ) {
    const savedMessage = await this.chatService.saveMessage(data);
    
    // Emit to shared conversation room
    const roomKey = data.recipient || data.recipientEmail || data.sender || data.guestEmail;
    if (roomKey) {
      this.server.to(roomKey).emit('newMessage', savedMessage);
    }
    
    // Always emit to admin room
    this.server.to('admin-room').emit('newMessage', savedMessage);
    
    return savedMessage;
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { name: string; isGuest: boolean; roomId?: string }) {
    if (data.roomId) {
      this.server.to(data.roomId).emit('userTyping', data);
    }
    this.server.to('admin-room').emit('userTyping', data);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@MessageBody() data: { name: string; isGuest: boolean; roomId?: string }) {
    if (data.roomId) {
      this.server.to(data.roomId).emit('userStoppedTyping', data);
    }
    this.server.to('admin-room').emit('userStoppedTyping', data);
  }

  @SubscribeMessage('findAllMessages')
  async findAll(@MessageBody() data: { participantId?: string; participantEmail?: string; isAdmin?: boolean }) {
    if (data.isAdmin) {
      return this.chatService.findAll();
    }
    return this.chatService.findConversation(data.participantId, data.participantEmail);
  }
}
