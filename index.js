import puppeteer from "puppeteer";
import cheerio from 'cheerio';

const RUBIUS_SITE = 'https://rubius.com';
const toPage = page => `${RUBIUS_SITE}/${page}`;
const TIMEOUT = 300;

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(toPage('projects'));

    // Фильтруем проекты по тегу Angular
    await page.click('.projects-page__tags app-filter-tag:nth-child(2)');
    await page.waitForTimeout(TIMEOUT);

    // Переходим на страницу проекта "Gas cylinder accounting system" 
    await page.click('.projects-page__projects a.project:first-child');
    await page.waitForTimeout(TIMEOUT);

    // Переходим по адресу проекта для получения актуального контента страницы
    await page.goto(page.url());

    // Парсим контент
    const content = await page.content();
    const $ = cheerio.load(content);

    const pageDef = {
        url: page.url(),
        title: $('.page-title').text(),
        subTitle: $('.page-subtitle').text(),
        content: $('.project-page .project-page__description').html()
    };

    console.log(pageDef);
    browser.close();

})();