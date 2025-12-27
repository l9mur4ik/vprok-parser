const { extractNumber } = require('./utils');

/**
 * Парсит страницу товара и извлекает сырые данные:
 * цену, старую цену (если есть скидка), рейтинг и количество отзывов.
 *
 * @param {import('puppeteer').Page} page - Экземпляр Puppeteer страницы
 * @returns {Promise<{ price: string|null, priceOld: string|null, rating: string|null, reviews: string|null }>}
 */
async function parseProduct(page) {
  // Ждём появления контейнера с ценой
  await page.waitForSelector('div.PriceInfo_root__GX9Xp', { timeout: 60000 });

  return page.evaluate(() => {
    const priceContainer = document.querySelector('div.PriceInfo_root__GX9Xp');
    if (!priceContainer) return { price: null, priceOld: null, rating: null, reviews: null };

    let price = null;
    let priceOld = null;

    // Найти все спаны с ценой внутри контейнера
    const spans = priceContainer.querySelectorAll('span.Price_price__QzA8L');
    spans.forEach((span) => {
      const cls = span.className;
      const text = span.textContent.trim();
      if (cls.includes('Price_role_discount')) price = text;
      else if (cls.includes('Price_role_old')) priceOld = text;
      else if (cls.includes('Price_role_regular') && !price) price = text;
    });

    // Рейтинг и отзывы
    const ratingEl = document.querySelector('a.ActionsRow_stars__EKt42');
    const reviewsEl = document.querySelector('a.ActionsRow_reviews__AfSj_');

    const rating = ratingEl ? ratingEl.getAttribute('title')?.replace('Оценка: ', '').trim() : null;
    const reviews = reviewsEl ? reviewsEl.textContent.trim() : null;

    return { price, priceOld, rating, reviews };
  });
}

/**
 * Нормализует сырые данные товара и преобразует их в числа.
 *
 * @param {{ price: string|null, priceOld: string|null, rating: string|null, reviews: string|null }} raw
 * @returns {{ price: number|null, priceOld: number|null, rating: number|null, reviewCount: number|null }}
 */
function normalizeProductData(raw) {
  return {
    price: raw.price ? extractNumber(raw.price) : null,
    priceOld: raw.priceOld ? extractNumber(raw.priceOld) : null,
    rating: raw.rating ? parseFloat(raw.rating) : null,
    reviewCount: raw.reviews ? extractNumber(raw.reviews) : null
  };
}

module.exports = {
  parseProduct,
  normalizeProductData
};