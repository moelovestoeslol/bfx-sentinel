const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
    name: 'stock',
    description: 'Manually check and display current Blox Fruits stock',
    async execute(message, args, client) {
        if (!eliteTrio.includes(message.author.id)) return message.reply('❌ Unauthorized.');

        const msg = await message.reply('🔍 Searching Wiki for stock...');

        try {
            // Using API endpoint to bypass data-center IP blocks
            const { data } = await axios.get('https://blox-fruits.fandom.com/api.php?action=parse&page=Blox_Fruits_Wiki&format=json', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json',
                    'Referer': 'https://blox-fruits.fandom.com/wiki/Blox_Fruits_Wiki'
                }
            });

            const html = data.parse.text['*'];
            const $ = cheerio.load(html);

            let currentStock = [];
            $('.fruit-name').each((i, el) => {
                const text = $(el).text().trim();
                if (text) currentStock.push(text);
            });

            if (currentStock.length === 0) {
                return await msg.edit('❌ No fruits found. The Wiki layout might have changed.');
            }

            const highTier = ["Kitsune", "Leopard", "Dragon", "Spirit", "Control", "Venom", "Shadow", "Dough", "Mammoth", "T-Rex"];
            const foundHighTier = currentStock.filter(fruit => highTier.includes(fruit));

            const stockEmbed = new EmbedBuilder()
                .setColor(0x010101)
                .setTitle('🍎 Current Blox Fruits Stock')
                .setDescription(currentStock.join(', '))
                .addFields(
                    { name: '🌟 Notable Fruits', value: foundHighTier.join(', ') || 'None currently' }
                )
                .setTimestamp()
                .setFooter({ text: 'BFX Sentinel • Manual Lookup' });

            await msg.edit({ content: null, embeds: [stockEmbed] });

        } catch (err) {
            console.error("Manual stock fetch failed:", err.message);
            await msg.edit('❌ Error 67 contact nuh');
        }
    },
};
