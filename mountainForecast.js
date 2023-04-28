import { launch } from 'puppeteer';

const MOUNTAIN_FORECAST_URL = 'https://www.mountain-forecast.com/peaks/Mooses-Tooth/forecasts/3150';

export async function scrape() {

    console.log('Scraping mountain forecast: ', MOUNTAIN_FORECAST_URL);

    const browser = await launch({args:['--no-sandbox']});
    const page = await browser.newPage();

    //go to mountain forecast moose's tooth summit page:
    await page.goto(MOUNTAIN_FORECAST_URL);

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
