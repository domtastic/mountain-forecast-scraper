import { formatMessages, sendMessages } from './message.js';
import { scrape } from './mountainForecast.js';

(async function getForecast() {

    try {
        const data = await scrape();
        console.log('Successfully scraped mountain forecast');
        const messages = formatMessages(data);
        console.log(`Have ${messages.length} messages to send`);
        await sendMessages(messages);
        console.log('Successfully sent all messages');
    } catch (err) {
        console.log('Error sending forecast: ', err);
    }
})();


