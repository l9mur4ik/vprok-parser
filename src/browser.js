const puppeteer = require('puppeteer');

/**
 * Создаёт и запускает браузер Puppeteer.
 * @param {Object} options
 * @param {boolean} options.headless - Режим без GUI
 * @param {Object} options.viewport - Размер окна { width, height }
 * @param {string[]} options.args - Дополнительные аргументы
 * @returns {Promise<import('puppeteer').Browser>}
 */
async function createBrowser(options = {}) {
  const {
    headless = 'new', // новый стабильный headless
    viewport = { width: 1920, height: 1080 },
    args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  } = options;

  try {
    const browser = await puppeteer.launch({ headless, defaultViewport: viewport, args });
    console.log(`Puppeteer браузер запущен (headless=${headless})`);
    return browser;
  } catch (err) {
    console.error('Не удалось запустить Puppeteer:', err.message);
    throw err;
  }
}

module.exports = { createBrowser };