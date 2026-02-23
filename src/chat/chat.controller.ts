import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, OnModuleInit } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController implements OnModuleInit {
  constructor(private readonly chatService: ChatService) {}

  async onModuleInit() {
    await this.chatService.seedDefaultBotConfigs();
  }

  // ========== Public: Get Bot Configs (for user app) ==========
  @Get('bot-configs/active')
  @ApiOperation({ summary: 'Get active bot configurations for the chat widget' })
  async getActiveBotConfigs() {
    return this.chatService.findActiveBotConfigs();
  }

  // ========== Admin: Bot Config CRUD ==========
  @Get('bot-configs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bot configurations' })
  async getAllBotConfigs() {
    return this.chatService.findAllBotConfigs();
  }

  @Post('bot-configs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new bot configuration' })
  async createBotConfig(@Body() body: any) {
    return this.chatService.createBotConfig(body);
  }

  @Put('bot-configs/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a bot configuration' })
  async updateBotConfig(@Param('id') id: string, @Body() body: any) {
    return this.chatService.updateBotConfig(id, body);
  }

  @Delete('bot-configs/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a bot configuration' })
  async deleteBotConfig(@Param('id') id: string) {
    return this.chatService.deleteBotConfig(id);
  }

  // ========== Admin: Activity / Audit Trail ==========
  @Get('activities')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity audit trail' })
  async getActivities(
    @Query('sessionId') sessionId?: string,
    @Query('event') event?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.findActivities({
      sessionId, event, startDate, endDate,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get('activity-stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity analytics summary' })
  async getActivityStats() {
    return this.chatService.getActivityStats();
  }

  // ========== Admin: Log activity from user app ==========
  @Post('activities')
  @ApiOperation({ summary: 'Log a user activity event' })
  async logActivity(@Body() body: any) {
    return this.chatService.logActivity(body);
  }

  // ========== Admin: Delete all messages ==========
  @Delete('messages')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all chat messages' })
  async clearMessages() {
    await this.chatService.clearAll();
    return { message: 'All messages cleared' };
  }
}
