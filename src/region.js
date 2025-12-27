/**
 * Выбирает регион на сайте vprok.ru и ждёт обновления страницы.
 *
 * @param {import('puppeteer').Page} page - Экземпляр Puppeteer страницы
 * @param {string} targetRegion - Название региона, например "Санкт-Петербург и область"
 */
async function selectRegion(page, targetRegion) {
  if (!targetRegion) return;

  try {
    // 1. Клик по кнопке текущего региона
    const regionButton = await page.$('button.Region_region__6OUBn');
    if (!regionButton) {
      console.log('Кнопка выбора региона не найдена, используем регион по умолчанию');
      return;
    }
    await regionButton.click();

    // 2. Ждём появления модального окна
    const modalSelector = 'div[role="dialog"]';
    await page.waitForSelector(modalSelector, { timeout: 10000 });

    // 3. Находим все кнопки регионов внутри модалки
    const buttons = await page.$$(modalSelector + ' button');

    let found = false;
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent.trim());
      if (text === targetRegion) {
        await btn.click();
        console.log(`Регион выбран: ${text}`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.warn(`Регион "${targetRegion}" не найден, используется регион по умолчанию`);
      return;
    }

    // 4. Ждём закрытия модального окна
    await page.waitForSelector(modalSelector, { hidden: true, timeout: 15000 });

    // 5. Ждём, пока цена для выбранного региона появится
    await page.waitForSelector('div.PriceInfo_root__GX9Xp span.Price_price__QzA8L', {
      timeout: 60000
    });

    console.log('Страница обновилась после выбора региона');
  } catch (err) {
    console.error(`Ошибка при выборе региона "${targetRegion}":`, err.message);
    throw err;
  }
}

module.exports = { selectRegion };