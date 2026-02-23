import {
  WebSocketGateway, SubscribeMessage, MessageBody,
  WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`[Chat] 🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[Chat] ❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const roomId = typeof data === 'string' ? data : data?.roomId;
    if (roomId) {
      client.join(roomId);
      const room = this.server.sockets.adapter.rooms.get(roomId);
      console.log(`[Chat] 🏠 ${client.id} joined [${roomId}] (${room?.size || 0} members)`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      sender?: string; guestName?: string; guestEmail?: string;
      content: string; conversationId: string;
      type?: string; imageUrl?: string;
      isAdmin?: boolean; isBot?: boolean;
    },
  ) {
    console.log(`[Chat] 🗯️ sendMessage from ${client.id}:`, JSON.stringify(data));

    if (!data.conversationId) {
      console.error('[Chat] ❌ REJECTED: No conversationId');
      return;
    }

    const savedMessage = await this.chatService.saveMessage(data);
    const messageObj = { ...savedMessage.toObject(), isAdmin: !!data.isAdmin, isBot: !!data.isBot };

    // Log activity
    this.chatService.logActivity({
      sessionId: data.conversationId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      event: data.isBot ? 'bot_reply' : 'chat_message',
      metadata: { isAdmin: !!data.isAdmin, contentPreview: data.content?.substring(0, 50) },
    }).catch(() => {});

    if (data.isAdmin || data.isBot) {
      console.log(`[Chat] 📤 ADMIN/BOT → [${data.conversationId}] + [admin-room]`);
      this.server.to(data.conversationId).emit('newMessage', messageObj);
      this.server.to('admin-room').emit('newMessage', messageObj);
    } else {
      console.log(`[Chat] 📤 USER → [admin-room] + [${data.conversationId}]`);
      this.server.to('admin-room').emit('newMessage', messageObj);
      this.server.to(data.conversationId).emit('newMessage', messageObj);
    }

    return messageObj;
  }

  @SubscribeMessage('trackActivity')
  async handleTrackActivity(@MessageBody() data: any) {
    try {
      await this.chatService.logActivity(data);
    } catch (e) {
      console.error('[Chat] Activity tracking error:', e.message);
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { name: string; isGuest: boolean; roomId?: string }) {
    if (data.roomId) this.server.to(data.roomId).emit('userTyping', data);
    this.server.to('admin-room').emit('userTyping', data);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@MessageBody() data: { name: string; isGuest: boolean; roomId?: string }) {
    if (data.roomId) this.server.to(data.roomId).emit('userStoppedTyping', data);
    this.server.to('admin-room').emit('userStoppedTyping', data);
  }

  @SubscribeMessage('findAllMessages')
  async findAll(@MessageBody() data: { conversationId?: string; isAdmin?: boolean }) {
    if (data.isAdmin) return this.chatService.findAll();
    return this.chatService.findConversationById(data.conversationId || '');
  }
}
