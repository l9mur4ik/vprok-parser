# vprok-parser

Парсер товаров сайта [vprok.ru](https://www.vprok.ru) с использованием Puppeteer.

Скрипт делает следующее:

- Выбирает регион на сайте
- Делает полноразмерный скриншот страницы товара (`screenshot.jpg`)
- Извлекает цену, старую цену (если есть), рейтинг и количество отзывов
- Сохраняет данные в `product.txt`

---

## Установка

```bash
git clone https://github.com/l9mur4ik/vprok-parser.git
cd vprok-parser
npm install
