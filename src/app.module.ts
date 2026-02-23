import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CellModule } from './cell/cell.module';
import { ProgramModule } from './program/program.module';
import { ArchiveModule } from './archive/archive.module';
import { MediaModule } from './media/media.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { ObjectiveModule } from './objective/objective.module';
import { ResponsibilityModule } from './responsibility/responsibility.module';
import { LanguageGroupModule } from './language-group/language-group.module';
import { FocusAreaModule } from './focus-area/focus-area.module';
import { OrganogramModule } from './organogram/organogram.module';
import { EnquiryModule } from './enquiry/enquiry.module';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        if (!redisHost) {
          console.log('[Cache] ℹ️ No REDIS_HOST provided. Using in-memory store.');
          return { ttl: 3600 };
        }
        try {
          console.log(`[Cache] 🔌 Attempting to connect to Redis at ${redisHost}...`);
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
              connectTimeout: 2000,
              reconnectStrategy: (retries) => (retries > 3 ? new Error('Redis connection failed') : Math.min(retries * 100, 1000)),
            },
            password: configService.get<string>('REDIS_PASSWORD'),
            ttl: parseInt(configService.get<string>('CACHE_TTL') || '3600'),
          });
          console.log('[Cache] ✅ Redis store initialized successfully.');
          return { store };
        } catch (error) {
          console.error('[Cache] ❌ Redis connection failed. Falling back to in-memory store:', error.message);
          return { ttl: 3600 };
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/panafstrag',
      }),
      inject: [ConfigService],
    }),
    AuthModule, 
    BoardModule, 
    CellModule, 
    ProgramModule, 
    ArchiveModule, 
    MediaModule, 
    AdminModule, 
    ChatModule,
    ObjectiveModule,
    ResponsibilityModule,
    LanguageGroupModule,
    FocusAreaModule,
    OrganogramModule,
    EnquiryModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
