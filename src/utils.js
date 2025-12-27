/**
 * Преобразует строку с числом в число (Number).
 * Убирает пробелы, валютные символы, оставляет только цифры и десятичную точку.
 * Если текст не содержит числа, возвращает null.
 *
 * @param {string} text - Строка с числом, например "86 ₽/шт" или "1 234,56"
 * @returns {number|null} - Число или null, если преобразовать не удалось
 */
function extractNumber(text) {
  if (!text || typeof text !== 'string') return null;

  // Убираем пробелы и заменяем запятую на точку
  let normalized = text.replace(/\s+/g, '').replace(',', '.');

  // Убираем все символы кроме цифр и точек
  normalized = normalized.replace(/[^\d.]/g, '');

  // Оставляем только первую точку (десятичную)
  normalized = normalized.replace(/(\..*)\./g, '$1');

  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? null : value;
}

/**
 * Проверяет, является ли строка корректным URL для сайта vprok.ru
 *
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если URL корректный и домен vprok.ru, иначе false
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith('vprok.ru');
  } catch {
    return false;
  }
}

module.exports = {
  extractNumber,
  validateUrl
};