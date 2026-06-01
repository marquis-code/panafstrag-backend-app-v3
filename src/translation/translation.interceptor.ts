import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from './translation.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  constructor(
    private readonly translationService: TranslationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const targetLang = request.headers['x-lang'];
    const method = request.method;

    // Only translate GET requests and only if a specific supported language is requested
    if (method !== 'GET' || !targetLang || targetLang === 'en') {
      return next.handle();
    }

    const url = request.originalUrl || request.url;
    const cacheKey = `trans_${targetLang}_${url}`;

    // Check cache
    let cachedResponse = null;
    try {
      cachedResponse = await this.cacheManager.get(cacheKey);
    } catch (error) {
      console.error('Redis Cache GET error:', error);
    }

    if (cachedResponse) {
      return new Observable((subscriber) => {
        subscriber.next(cachedResponse);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      map(async (data) => {
        if (!data) return data;
        
        let translatedData = data;
        try {
          translatedData = await this.translationService.translateObject(data, targetLang);
        } catch (error) {
          console.error('Translation error in interceptor:', error);
        }
        
        try {
          // Cache for 1 hour (3600000 ms)
          await this.cacheManager.set(cacheKey, translatedData, 3600000);
        } catch (error) {
          console.error('Redis Cache SET error:', error);
        }
        
        return translatedData;
      }),
    );
  }
}
