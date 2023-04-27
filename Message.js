const puppeteer = require('puppeteer');
const { textToSend } = require('./Scraper.js')


async function message() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    //open page
    await page.goto('https://share.garmin.com/dominicg');
    await page.waitForTimeout(5000); // wait for 5 seconds

   //test we are on the correct page
   // const title = await page.evaluate(() => document.title);
   // console.log(title);
console.log();
    //open message box by clicking message link
    //data-test-id="topBtnMessage"
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click("#user-messaging-controls > div:nth-child(2) > a"),
        page.$eval('#messageFrom', el => el.value = 'gonza362@gmail.com'),
        page.$eval('#textMessage', el => el.value = textToSend),

    ]);
    // await page.type('input[id=login_field]', 'gonza362@gmail.com');
   // await page.$eval('#messageFrom', el => el.value = 'gonza362@gmail.com');

   await browser.close();

}
//message();

module.exports = { message };
