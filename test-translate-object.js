import { TranslationService } from './dist/translation/translation.service.js';

// Mock cache manager
const cacheManager = {
  get: async () => null,
  set: async () => {}
};

const service = new TranslationService(cacheManager);

const obj = {
  title: "PANAFSTRAG Mission Statement",
  description: "To provide actionable insights and evidence-based policy recommendations that drive African self-determination, economic emancipation and social justice."
};

async function run() {
  console.log("Before:", obj);
  const result = await service.translateObject(obj, 'fr');
  console.log("After:", result);
}
run();
