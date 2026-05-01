const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '147966028055376853', '1014550997072347137'];

module.exports = {
    name: 'stock',
    description: 'Manually check and display current Blox Fruits stock',
    async execute(message, args, client) {
        // Keeping it owner only like your template
        if (!eliteTrio.includes(message.author.id)) return message.reply('❌ Unauthorized.');

        const msg = await message.reply('🔍 Fetching current stock from Wiki...');

        try {
            const { data } = await axios.get('https://blox-fruits.fandom.com/wiki/Blox_Fruits_Wiki');
            const $ = cheerio.load(data);

            let currentStock = [];
            $('.stock-container .fruit-name').each((i, el) => {
                currentStock.push($(el).text().trim());
            });

            const highTier = ["Kitsune", "Leopard", "Dragon", "Spirit", "Control", "Venom", "Shadow", "Dough", "Mammoth", "T-Rex"];
            const foundHighTier = currentStock.filter(fruit => highTier.includes(fruit));

            const stockEmbed = new EmbedBuilder()
                .setColor(0x0x010101)
                .setTitle('🍎 Current Blox Fruits Stock')
                .setDescription(currentStock.join(', ') || "Check Wiki for live data")
                .addFields(
                    { name: '🌟 Notable Fruits', value: foundHighTier.join(', ') || 'None' }
                )
                .setTimestamp()
                .setFooter({ text: 'BFX Sentinel • Manual Lookup' });

            await msg.edit({ content: null, embeds: [stockEmbed] });

        } catch (err) {
            console.error("Stock fetch failed.");
            await msg.edit('❌ Failed to fetch stock. The Wiki might be down or layout changed.');
        }
    },
};
