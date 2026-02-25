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
          
          // Use a shorter timeout and more controlled reconnection for initialization
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
              connectTimeout: 5000,
              reconnectStrategy: (retries) => {
                if (retries > 2) {
                  // Returning false stops the reconnection attempts
                  return false;
                }
                return Math.min(retries * 100, 1000);
              },
            },
            password: configService.get<string>('REDIS_PASSWORD'),
            ttl: parseInt(configService.get<string>('CACHE_TTL') || '3600'),
          });

          // Verify connectivity before returning the store
          // If it fails here, it will be caught by the try-catch
          await store.client.connect();
          
          // Add an error listener to prevent unhandled error events from crashing the process
          store.client.on('error', (err) => {
            console.error('[Cache] ⚠️ Redis client error:', err.message);
          });

          console.log('[Cache] ✅ Redis store connected successfully.');
          return { store };
        } catch (error) {
          console.error('[Cache] ❌ Redis connection failed. Falling back to in-memory store.');
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
