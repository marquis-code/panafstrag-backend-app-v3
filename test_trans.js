const translate = require('google-translate-api-x');

async function test() {
  try {
    const res = await translate('Hello world', { to: 'fr' });
    console.log(res.text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
