process.env.NTBA_FIX_319 = 1;

const needle = require('needle');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '874986523:AAG7TfHj6UyGMMp09pv8Y5LBAi1KfOkAGEA';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messages = msg.text;

    if (messages == 'Футбол') {
        url = 'https://www.marathonbet.com/su/live/26418';
        t = 50;
    } else if (messages == 'Хоккей') {
        url = 'https://www.marathonbet.com/su/live/43658';
        t = 30;
    } else {
        bot.sendMessage(chatId, 'Привет! Чтобы получить ставки на напиши Футбол или Хоккей. Если в ответ ни чего не пришло, значит сейчас нет подходящих ставок! Повтори чуть позже...');
        return;
    }

    needle.get(url, (err, res) => {
        if(err) {
            console.log(err);
            return;
        }
         
        var $ = cheerio.load(res.body);
    
        cat = $(".content .sport-category-label").text();
        content = $(".member-area-content-table");

        content.each( function() {
            commandHome = $(this).find('.live-today-name span').eq(0).text();
            commandGuest = $(this).find('.live-today-name span').eq(1).text();
            id = $(this).find('.border-right div').attr('data-favorites-selector');
            time = $(this).find('.nobr').text().replace(/\n/g, '').trim();
            $(this).find('.nobr').remove();
            result = $(this).find('.red').text().replace(/\n/g, '').trim();
 
            upResult = result.split(/(\d:\d)/);
            upTime = time.split(/(\d{2})/);

            console.log(upResult[1]);

            if ((upTime[1] > t) && (upResult[1].includes('0'))) {
                body = cat + "\n" + 'Команды: ' + commandHome + ' - ' + commandGuest + "\n" + 'Счет: ' + result + "\n" + 'Время: ' + time;
                bot.sendMessage(chatId, body);
                console.log(body);
            }
        });
    });
});
