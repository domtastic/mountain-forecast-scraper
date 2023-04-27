const puppeteer = require('puppeteer');
let textToSend = "testing...";
let newDescr = "test test 1 2 3";
async function getForecast() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('1: ' + textToSend);

    //go to mountain forecast moose's tooth summit page:
    await page.goto('https://www.mountain-forecast.com/peaks/Mooses-Tooth/forecasts/3150');
    const tempLow = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table-min-temperature .forecast__table-value'), (e)=> e.innerText)
    );
    console.log("Low Temp: " + tempLow);
    console.log("Number of Characters: " + tempLow.length);
    console.log(typeof tempLow);
    //let newLowTemp;
   // newLowTemp = tempLow.replace(/\s/g, '');
   // let lowtempKey;
    //let lowtempvalue;
    //lowtempKey = Object.keys(tempLow);
    //lowtempvalue = Object.values(tempLow);

    //console.log(lowtempKey);
    //console.log(lowtempvalue);
    //console.log(newLowTemp);

    const snowArr = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.snow'), (e)=> e.innerText)
    );
    console.log("snow: " + snowArr);

    textToSend = "snow: " + snowArr;
    // console.log("Low Temp: " + tempLow);
    console.log('2: ' + textToSend);

    const forecastDescription = await page.evaluate(()=>
        Array.from(document.querySelectorAll(
            '#forecast-table > thead > tr.forecast__table-description.show-for-large.js-fctable-description > td.forecast__table-description-item > p > span'),
            (e)=> e.innerText)
    );

    newDescr = "D " + forecastDescription;
    console.log(newDescr);
    console.log(newDescr.length);
    console.log(forecastDescription.length);
    let strDescription;
    strDescription = JSON.stringify(forecastDescription);
    console.log(strDescription.length);
    //  const elevation = await page.$eval('.elevation', element => element.textContent.trim());
    // console.log(`The highest elevation forecast for Moose's Tooth in Alaska is ${elevation}`);

  // message(textToSend);
     message(newDescr);
    await browser.close();
}
//getForecast();s

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


//--------------------------------------------------------------------------------

async function message(text) {
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
    console.log('3: ' + text);
    console.log("Number of Characters: " + text.length);
    //open message box by clicking message link
    //data-test-id="topBtnMessage"
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click("#user-messaging-controls > div:nth-child(2) > a"),
        page.waitForNavigation(),
        page.type('#messageFrom', "gonza362@gmail.com", {delay: 100}), // Types slower, like a user
        page.type('#textMessage', text, {delay: 10})// Types faster, just like robot



     //   page.evaluate((text) => {
      //      document.querySelector("#messageFrom").value = "gonza362@gmail.com";
       //     document.querySelector("#textMessage").value = text;
       // },text)

      //  page.$eval('#messageFrom', el => el.value = 'gonza362@gmail.com'),
    //   page.$eval('#textMessage', (el, value) => el.value = text),

       /* page.$eval('#textMessage', (el, text) => {
            el.value = text
        }, text)
        */
    ]);
    // await page.type('input[id=login_field]', 'gonza362@gmail.com');
   // await browser.close();
}
//message();
//getForecast().then(message);

getForecast();