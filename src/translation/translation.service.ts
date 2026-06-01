import { Injectable, Logger, Inject } from '@nestjs/common';
import translate from 'google-translate-api-x';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Exclude technical keys, URLs, and anything that shouldn't be translated
  private excludeFields = [
    '_id', 'id', '__v', 'createdAt', 'updatedAt', 'email', 'slug', 'url',
    'password', 'token', 'avatar', 'imageUrl', 'fileUrl', 'link', 'status',
    'isActive', 'isDeleted', 'role', 'phone', 'ip', 'type'
  ];

  private hashString(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    if (!text || typeof text !== 'string') return text;
    // Basic heuristics to avoid translating code-like strings
    if (text.length < 2) return text;
    if (text.startsWith('http') || text.startsWith('www') || text.includes('://')) return text;

    const hash = this.hashString(text);
    const cacheKey = `trans_str_${targetLang}_${hash}`;

    try {
      const cached = await this.cacheManager.get<string>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      this.logger.warn('Cache error on get', e);
    }

    try {
      const res = await translate(text, { to: targetLang });
      if (res && res.text) {
        try {
          // Cache individual string for a long time (e.g. 30 days) to make future translations instant
          await this.cacheManager.set(cacheKey, res.text, 2592000000);
        } catch (e) {
          this.logger.warn('Cache error on set', e);
        }
        return res.text;
      }
      return text;
    } catch (error) {
      this.logger.error(`Translation failed for text: ${text.substring(0, 20)}...`, error);
      return text;
    }
  }

  async translateObject(obj: any, targetLang: string): Promise<any> {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      return this.translateText(obj, targetLang);
    }
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.translateObject(item, targetLang)));
    }
    if (typeof obj === 'object') {
      // Handle MongoDB ObjectIDs or Dates
      if (obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') return obj;
      
      const translatedObj = { ...obj };
      const tasks: Promise<any>[] = [];
      const keys: string[] = [];

      // Concurrently process all keys rather than waiting sequentially
      for (const key of Object.keys(translatedObj)) {
        if (this.excludeFields.includes(key)) continue;
        keys.push(key);
        tasks.push(this.translateObject(translatedObj[key], targetLang));
      }

      const results = await Promise.all(tasks);

      for (let i = 0; i < keys.length; i++) {
        translatedObj[keys[i]] = results[i];
      }

      return translatedObj;
    }
    return obj;
  }
}
