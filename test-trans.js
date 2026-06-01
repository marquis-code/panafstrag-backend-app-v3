const translate = require('google-translate-api-x');

async function run() {
  try {
    const res = await translate(["Hello", "World"], { to: 'fr' });
    console.log(Array.isArray(res));
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}
run();
