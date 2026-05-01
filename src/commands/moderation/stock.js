const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '147966028055376853', '1014550997072347137'];

module.exports = {
    name: 'stock',
    description: 'Manually check and display current Blox Fruits stock',
    async execute(message, args, client) {
        if (!eliteTrio.includes(message.author.id)) return message.reply('❌ Unauthorized.');

        const msg = await message.reply('🔍 Searching Wiki for stock...');

        try {
            const { data } = await axios.get('https://blox-fruits.fandom.com/wiki/Blox_Fruits_Wiki');
            const $ = cheerio.load(data);

            let currentStock = [];

            // Attempting a broader search for the fruit names
            $('.fruit-name').each((i, el) => {
                const text = $(el).text().trim();
                if (text) currentStock.push(text);
            });

            // DEBUG: Check your terminal to see if currentStock is empty
            console.log("Fruits found:", currentStock);

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
            console.error("Stock fetch failed:", err.message);
            await msg.edit('❌ Error 67 contact nuh');
        }
    },
};
