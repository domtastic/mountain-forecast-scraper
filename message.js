import { launch } from 'puppeteer';

const CHAR_LIMIT = 160;
const MAPSHARE_URL = 'https://share.garmin.com/zrunyan';

export function formatMessages(data) {

    const messages = [];

    let message = '';
    data.map((d, i) => {
        // every 5 lines, create message to send (truncating at char limit)
        if (i != 0 && i % 5 == 0) {
            // ensure we don't go over char limit per message
            messages.push(message.substring(0, CHAR_LIMIT));
            message = '';
        }
        message += `${shortenDay(d.dateTime)}:h${d.highTemp}:f${d.feelTemp},w${d.windSpeed}${d.windDirection}:s${d.snow != '-' ? d.snow : '' }\n`;
    });

    return messages;
}

export async function sendMessages(messages) {
    const browser = await launch({args:['--no-sandbox']});
    const page = await browser.newPage();

    //open page
    await page.goto(MAPSHARE_URL);
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

