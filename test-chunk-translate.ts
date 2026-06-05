import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { TranslationService } from './src/translation/translation.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(TranslationService);
  const obj = {
    title: 'Testing chunking',
    content: "<p>First paragraph.</p><p>Second paragraph.</p>".repeat(150) // ~7350 chars
  };
  console.log('Length of content:', obj.content.length);
  const result = await service.translateObject(obj, 'fr');
  console.log('Result length:', result.content.length);
  console.log('Result snippet:', result.content.substring(0, 100));
  await app.close();
}
bootstrap();
