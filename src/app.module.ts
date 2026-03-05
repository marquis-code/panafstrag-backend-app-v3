import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
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
import { HomeContentModule } from './home-content/home-content.module';
import { SearchModule } from './search/search.module';
import { ActiveBannerModule } from './active-banner/active-banner.module';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
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
          
          const redisPort = parseInt(configService.get<string>('REDIS_PORT') || '6379');
          const redisPassword = configService.get<string>('REDIS_PASSWORD');

          // Use a shorter timeout and more controlled reconnection
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: redisPort,
              connectTimeout: 5000,
              reconnectStrategy: (retries) => {
                if (retries > 3) return false; // Stop after 3 retries
                return Math.min(retries * 500, 2000);
              },
            },
            password: redisPassword,
            ttl: parseInt(configService.get<string>('CACHE_TTL') || '3600'),
          });

          // Add the error listener IMMEDIATELY before connecting
          store.client.on('error', (err) => {
            console.error('[Cache] ⚠️ Redis client error:', err.message);
          });

          // Attempt connection with a timeout
          await Promise.race([
            store.client.connect(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 6000))
          ]);
          
          console.log('[Cache] ✅ Redis store connected successfully.');
          return { store };
        } catch (error: any) {
          console.error('[Cache] ❌ Redis connection failed:', error.message);
          console.log('[Cache] ℹ️ Falling back to in-memory store.');
          return { 
            ttl: 3600,
            // Returning empty object or undefined store triggers internal memory fallback in many versions
          };
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
    EnquiryModule,
    HomeContentModule,
    SearchModule,
    ActiveBannerModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
