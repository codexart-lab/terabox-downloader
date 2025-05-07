import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import axios from 'axios';

const BOT_TOKEN = '7778288292:AAHTnGkxJcA7Oohu8mdULkDbCe9a6zrcTWU';
const PORT = 8080;
const bot = new Telegraf(BOT_TOKEN);
const app = express();

const teraboxUrlRegex = /^https?:\/\/(?:www\.)?(?:[\w-]+\.)?(terabox\.com|1024terabox\.com|teraboxapp\.com|terafileshare\.com|teraboxlink\.com|terasharelink\.com)\/(s|sharing)\/[\w-]+/i;

app.use(express.json());
app.use(bot.webhookCallback('/webhook'));
app.get('/', (_, res) => res.send('🤖 Bot is running!'));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

bot.start(ctx => {
    ctx.replyWithPhoto(
        { url: 'https://i.ibb.co/TqdF0d7s/Catwoman.jpg' },
        {
            caption: '👋 Welcome to TeraBox Downloader Bot!\n\nSend me a TeraBox sharing link.',
            ...Markup.inlineKeyboard([
                [Markup.button.url('📌 Join Channel', 'https://t.me/codexfusion')]
            ])
        }
    );
});

bot.on('text', async ctx => {
    const text = ctx.message.text.trim();
    if (!teraboxUrlRegex.test(text)) return;

    try {
        const msg = await ctx.reply('⏳ Processing...');
        const { data } = await axios.get(`https://wdzone-terabox-api.vercel.app/api?url=${encodeURIComponent(text)}`, { timeout: 120000 });

        const file = data?.['📜 Extracted Info']?.[0];
        const link = file?.['🔽 Direct Download Link'];

        await ctx.deleteMessage(msg.message_id);

        if (link) {
            await ctx.reply(
                '✅ Download your file:',
                Markup.inlineKeyboard([
                    [Markup.button.url('🔗 Download Now', link)]
                ])
            );
        } else {
            await ctx.reply('❌ No downloadable link found.');
        }
    } catch (err) {
        console.error(err.message);
        await ctx.reply('❌ Failed to process the link.');
    }
});

// Set webhook
(async () => {
    try {
        await bot.telegram.setWebhook('https://existing-gay-codexart-lab-2f129e77.koyeb.app/webhook');
        console.log('✅ Webhook set');
    } catch (err) {
        console.error('Webhook error:', err.message);
    }
})();
