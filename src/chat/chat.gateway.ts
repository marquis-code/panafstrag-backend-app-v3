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

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { 
      sender?: string; 
      guestName?: string; 
      guestEmail?: string; 
      content: string;
      type?: string;
      imageUrl?: string;
    },
  ) {
    const savedMessage = await this.chatService.saveMessage(data);
    this.server.emit('newMessage', savedMessage);
    return savedMessage;
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { name: string; isGuest: boolean }) {
    this.server.emit('userTyping', data);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@MessageBody() data: { name: string; isGuest: boolean }) {
    this.server.emit('userStoppedTyping', data);
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    return this.chatService.findAll();
  }
}
