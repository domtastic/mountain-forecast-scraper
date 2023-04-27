import puppeteer from 'puppeteer';

async function sendMessage(messages) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //open page
    await page.goto('https://share.garmin.com/zrunyan');
    await page.waitForTimeout(5000); // wait for 5 seconds

    let i = 0;
    for (const message of messages) {
        console.log(`Sending message ${i+1} of ${messages.length}`);
        await page.waitForTimeout(3000); // wait for 5 seconds
        await page.click("#user-messaging-controls > div:nth-child(2) > a");
        await page.waitForTimeout(5000); // wait for 5 seconds
        await page.evaluate(()=> $('#messageFrom').val(''));
        await page.evaluate(()=> $('#textMessage').val(''));
        await page.type('#messageFrom', "gonza362@gmail.com"); // Types slower, like a user
        await page.type('#textMessage', message)// Types faster, just like robot
        await page.waitForTimeout(5000); // wait for 5 seconds
        await page.evaluate(()=> $('.modal-footer').andSelf().find('[data-test-id="MessageUserSend"]').click());
        i++;
    }
}

async function getForecast() {

    const url = 'https://www.mountain-forecast.com/peaks/Mooses-Tooth/forecasts/3150';
    console.log('Scraping mountain forecast: ', url);

    const browser = await puppeteer.launch({ dumpio: true });
    const page = await browser.newPage();

    //go to mountain forecast moose's tooth summit page:
    await page.goto(url);

    const dayData = await scrape(page, true);

    console.log('Successfully scraped mountain forecast');

    let messages = [];

    let message = '';
    dayData.map((d, i) => {
        if (i != 0 && i % 5 == 0) {
            messages.push(message);
            message = '';
        }
        message += `${shortenDay(d.dateTime)}:h${d.highTemp}:f${d.feelTemp},w${d.windSpeed}${d.windDirection}:s${d.snow != '-' ? d.snow : '' }\n`;
    });

    console.log(`Have ${messages.length} messages to send`);

    await sendMessage(messages);

    console.log('Successfully sent all messages');
}

function shortenDay(d) {

    const day = d.split('-')[0];
    let short = '';
    switch (day) {
        case 'Monday':
            short = 'M'
            break;
        case 'Tuesday':
            short = 'T'
            break;
        case 'Wednesday':
            short = 'W'
            break;
        case 'Thursday':
            short = 'Th';
            break;
        case 'Friday':
            short = 'F';
            break;
        case 'Saturday':
            short = 'Sa';
            break;
        case 'Sunday':
            short = 'Su';
            break;
    }

    const shortDay = d.replace(day, short);
    return shortDay.replace('night', 'N');
}

async function scrape(page, click) {

    // timeouts needed - won't send all data without
    await page.waitForTimeout(5000)
    await page.click('#forecast-table > thead > tr.forecast__table-days.js-fctable-days > td:nth-child(3) > button', { offset: { x: 4, y: 4 } });
        await page.waitForTimeout(4000)
        await page.click('.forecast__table-days.js-fctable-days > td:nth-child(2) > button', { offset: { x: 4, y: 4 } });
        await page.waitForTimeout(4000)
        await page.click('#forecast-table > thead > tr.forecast__table-days.js-fctable-days > td.forecast__table-days-item.forecast__table-day-end.forecast__table-day-odd.fc-table-cell-highlight > button.forecast__table-days-toggle.fc-table-lead-button-secondary.fc-table-lead-button-t', { offset: { x: 4, y: 4 } });
        await page.waitForTimeout(3000)
    const times = await page.evaluate(() => $('.forecast__table-time .forecast__table-value').map((i, v) => v.innerHTML.trim()).toArray());
    const lowTemps = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table-min-temperature .forecast__table-value'), (e)=> e.innerText)
    );
    const highTemps = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table-max-temperature .forecast__table-value'), (e)=> e.innerText)
    );
    const feelTemps = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.forecast__table-feels .forecast__table-value'), (e)=> e.innerText)
    );

    const windSpeeds = await page.evaluate(() => $('.wind-icon__val').map((i, v) => v.innerHTML).toArray());
    const windDirections = await page.evaluate(() => $('.wind-icon__tooltip').map((i, v) => v.innerHTML).toArray());

    const snow = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.snow'), (e)=> e.innerText)
    );

    const coverage = await page.evaluate(() => $('.icon-weather__image').map((i, v) => v.alt).toArray());

    const data = await page.evaluate(async (times, lowTemps, highTemps, feelTemps, windSpeeds, windDirections, snow) => {
        const rawDates = $('.forecast__table-days-item').map((i, v) => v.innerText.trim().replace('\n', '-')).toArray();
        const colSpans = $('.forecast__table-days-item').map((i, v) => $(v).prop('colSpan')).toArray();
        const dates = [];
        let columnIndex = 0;
        rawDates.map((d, i) => {
            for (let j=0;j<colSpans[i];j++) {
                dates.push({
                    dateTime: `${d}-${times[columnIndex]}`,
                    highTemp: highTemps[columnIndex],
                    feelTemp: feelTemps[columnIndex],
                    windSpeed: windSpeeds[columnIndex],
                    windDirection: windDirections[columnIndex],
                    snow: snow[columnIndex],
                })
                columnIndex++;
            }
        })
        return dates;
    }, times, lowTemps, highTemps, feelTemps, windSpeeds, windDirections, snow);

    return data;
}

getForecast();
