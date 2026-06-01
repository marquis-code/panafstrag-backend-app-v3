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
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return new Observable((subscriber) => {
        subscriber.next(cachedResponse);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      map(async (data) => {
        if (!data) return data;
        
        try {
          const translatedData = await this.translationService.translateObject(data, targetLang);
          
          // Cache for 1 hour (3600000 ms)
          await this.cacheManager.set(cacheKey, translatedData, 3600000);
          return translatedData;
        } catch (error) {
          console.error('Translation error in interceptor:', error);
          return data; // Return original data on failure
        }
      }),
    );
  }
}
