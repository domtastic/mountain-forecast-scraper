const puppeteer = require('puppeteer');
const { message } = require('./Message.js')
let textToSend;

async function getForecast() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //go to mountain forecast moose's tooth summit page:
    await page.goto('https://www.mountain-forecast.com/peaks/Mooses-Tooth/forecasts/3150');
    const tempLow = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table-min-temperature'), (e)=> e.innerText)
    );
    console.log("Low Temp: " + tempLow);

    /* async function clickElement(){
        //identify element then click
        await page.click("button[data-units='Imperial']");
        //get page title after click
        console.log(await page.title())
    }
    clickElement()
    */

    //all text on page
  //  const text = await  page.evaluate(()=> document.body.innerText);
    //console.log(text);
    //screenshot:
    // await page.screenshot({path: 'screenshot.png', fullPage: true});

    //all links on page
   /* const links = await page.evaluate(()=>
        Array.from(document.querySelectorAll('a'), (e)=> e.href)
        );
    console.log(links);
    */

    // const title = await page.evaluate(()=>document.title);
    // console.log(title);

    const snow = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table-snow'), (e)=> ({text: e.querySelector('.snow').innerText}))
    );
    console.log(snow);

   const day = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table'), (e)=> ({text: e.querySelector('.forecast__table-days-content').innerText}))
    );
    console.log(day);

//OR
   /* const info = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table'), (e)=> ({
            description: e.querySelector('.forecast__table-days-content').innerText,
            day: e.querySelector('.forecast__table-days-content').innerText,
            snow: e.querySelector('.snow').innerText
        }))
    );

    console.log(info);
*/

    const snowArr = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.snow'), (e)=> e.innerText)
    );
    console.log("snow: " + snowArr);

    textToSend = "snow: " + snowArr;
   // console.log("Low Temp: " + tempLow);

    const forecastDescription = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.location-summary__item'), (e)=> e.innerText)
    );
    console.log("Description: " + forecastDescription);

  //  const elevation = await page.$eval('.elevation', element => element.textContent.trim());
   // console.log(`The highest elevation forecast for Moose's Tooth in Alaska is ${elevation}`);

    message();
    await browser.close();
}
//getForecast();

/*
async function main() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://share.garmin.com/dominicg');
    await page.waitForTimeout(5000); // wait for 5 seconds
    const title = await page.evaluate(()=>document.title);
    console.log(title);
    await browser.close();
}

 */

//getForecast().then(message);

getForecast();
module.exports = { textToSend };
