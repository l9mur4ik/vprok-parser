const fs = require('fs/promises');
const { createBrowser } = require('./browser');
const { selectRegion } = require('./region');
const { parseProduct, normalizeProductData } = require('./productParser');
const { validateUrl } = require('./utils');

/**
 * Основная функция скрипта
 * @param {string} productUrl - URL страницы товара на vprok.ru
 * @param {string} [region] - Регион для выбора (например, "Санкт-Петербург и область")
 */
async function main() {
  const [productUrl, region] = process.argv.slice(2);

  if (!productUrl || !validateUrl(productUrl)) {
    console.error('Передайте корректный URL товара vprok.ru');
    process.exit(1);
  }

  const browser = await createBrowser({ headless: 'new' });
  const page = await browser.newPage();

  // Эмуляция User-Agent для стабильной подгрузки контента
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  try {
    console.log(`Загружаем страницу: ${productUrl}`);
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 120000 });

    // Ждём базовых элементов страницы
    await Promise.all([
      page.waitForSelector('h1', { timeout: 60000 }),
      page.waitForSelector('button[class*="buy"]', { timeout: 60000 })
    ]);

    // Выбор региона, если указан
    if (region) {
      console.log(`Выбираем регион: ${region}`);
      await selectRegion(page, region);
    }

    // Парсим данные товара
    const rawData = await parseProduct(page);
    const product = normalizeProductData(rawData);

    console.log(product);

    // Скриншот страницы
    await page.screenshot({ path: 'screenshot.jpg', fullPage: true });
    console.log('Скриншот сохранён: screenshot.jpg');

    // Сохраняем данные в product.txt
    const output = [
      `price=${product.price ?? 'N/A'}`,
      `priceOld=${product.priceOld ?? 'N/A'}`,
      `rating=${product.rating ?? 'N/A'}`,
      `reviewCount=${product.reviewCount ?? 'N/A'}`
    ].join('\n');

    await fs.writeFile('product.txt', output, 'utf8');
    console.log('Данные сохранены: product.txt');
  } catch (err) {
    console.error('Ошибка при обработке товара:', err.message);
    try {
      await page.screenshot({ path: 'error.jpg', fullPage: true });
      console.log('Скриншот ошибки: error.jpg');
    } catch {}
    process.exit(1);
  } finally {
    await browser.close();
    console.log('Браузер закрыт');
  }
}

// Запуск скрипта, если выполняется напрямую
if (require.main === module) {
  main();
}