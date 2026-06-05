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
    if (text.length < 2) return text;
    if (text.startsWith('http') || text.startsWith('www') || text.includes('://')) return text;

    const hash = this.hashString(text);
    const cacheKey = `trans_str_v2_${targetLang}_${hash}`;

    try {
      const cached = await this.cacheManager.get<string>(cacheKey);
      if (cached) return cached;
    } catch (e) {}

    try {
      const res = await translate(text, { to: targetLang });
      if (res && res.text) {
        await this.cacheManager.set(cacheKey, res.text, 2592000000);
        return res.text;
      }
      return text;
    } catch (error) {
      this.logger.error(`Translation failed: ${text.substring(0, 20)}`, error);
      return text;
    }
  }

  async translateObject(obj: any, targetLang: string): Promise<any> {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      return this.translateText(obj, targetLang);
    }

    // Deep clone plain objects/arrays to avoid mutating original references
    const cloneObject = (item: any): any => {
      if (item === null || typeof item !== 'object') return item;
      if (item.constructor.name !== 'Object' && item.constructor.name !== 'Array') return item;
      if (Array.isArray(item)) return item.map(cloneObject);
      const cloned: any = {};
      for (const key of Object.keys(item)) {
        cloned[key] = cloneObject(item[key]);
      }
      return cloned;
    };

    const clonedObj = cloneObject(obj);
    const stringsToTranslate: { parent: any, key: string | number, text: string }[] = [];

    const collectStrings = (current: any) => {
      if (current === null || typeof current !== 'object') return;
      if (current.constructor.name !== 'Object' && current.constructor.name !== 'Array') return;

      const keys = Array.isArray(current) ? current.map((_, i) => i) : Object.keys(current);
      
      for (const key of keys) {
        const val = current[key];
        if (typeof key === 'string' && this.excludeFields.includes(key)) continue;

        if (typeof val === 'string') {
          if (val.length >= 2 && !val.startsWith('http') && !val.startsWith('www') && !val.startsWith('https')) {
            stringsToTranslate.push({ parent: current, key, text: val });
          }
        } else if (typeof val === 'object') {
          collectStrings(val);
        }
      }
    };

    collectStrings(clonedObj);

    if (stringsToTranslate.length === 0) return clonedObj;

    const textsToFetch: { originalIndex: number, text: string, cacheKey: string }[] = [];
    const finalTranslations: string[] = new Array(stringsToTranslate.length);

    // 1. Check Cache
    for (let i = 0; i < stringsToTranslate.length; i++) {
      const text = stringsToTranslate[i].text;
      const hash = this.hashString(text);
      const cacheKey = `trans_str_v2_${targetLang}_${hash}`;
      
      let cached: string | undefined;
      try {
        cached = await this.cacheManager.get<string>(cacheKey);
      } catch (e) {}

      if (cached) {
        finalTranslations[i] = cached;
      } else {
        textsToFetch.push({ originalIndex: i, text, cacheKey });
      }
    }

    // 2. Fetch Missing Texts Individually (to prevent one failure from failing all)
    if (textsToFetch.length > 0) {
      const translationPromises = textsToFetch.map(async (item) => {
        try {
          const res = await translate(item.text, { to: targetLang });
          if (res && res.text) {
            finalTranslations[item.originalIndex] = res.text;
            // Save to cache
            await this.cacheManager.set(item.cacheKey, res.text, 2592000000).catch(() => {});
          } else {
            finalTranslations[item.originalIndex] = item.text;
          }
        } catch (error) {
          this.logger.error(`Individual translation failed for text starting with: ${item.text.substring(0, 20)}`, error);
          finalTranslations[item.originalIndex] = item.text;
        }
      });
      await Promise.all(translationPromises);
    }

    // 3. Apply Translations Back
    for (let i = 0; i < stringsToTranslate.length; i++) {
      if (finalTranslations[i]) {
        stringsToTranslate[i].parent[stringsToTranslate[i].key] = finalTranslations[i];
      }
    }

    return clonedObj;
  }
}
