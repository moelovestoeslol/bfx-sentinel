const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];
const pingRoleId = '1279282973916790837';

module.exports = {
  name: 'enablestock',
  async execute(message, args, client) {
    if (!eliteTrio.includes(message.author.id)) return message.reply('❌ Unauthorized.');

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return message.reply('❌ Usage: `?enablestock #channel`');

    client.stockChannel = channel.id;
    message.reply(`✅ Auto-stock updates enabled in <#${channel.id}>.`);

    if (!client.stockInterval) {
      client.stockInterval = setInterval(async () => {
        if (!client.stockChannel) return;

        try {
          // Added headers here too
          const { data } = await axios.get('https://blox-fruits.fandom.com/wiki/Blox_Fruits_Wiki', {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          const $ = cheerio.load(data);
          
          let currentStock = [];
          $('.stock-container .fruit-name').each((i, el) => {
            currentStock.push($(el).text().trim());
          });

          const highTier = ["Kitsune", "Leopard", "Dragon", "Spirit", "Control", "Venom", "Shadow", "Dough", "Mammoth", "T-Rex"];
          const foundHighTier = currentStock.filter(fruit => highTier.includes(fruit));

          const stockEmbed = new EmbedBuilder()
            .setColor(0x010101)
            .setTitle('🍎 Blox Fruits Current Stock')
            .setDescription(currentStock.join(', ') || "Check Wiki for live data")
            .setTimestamp();

          const targetChannel = client.channels.cache.get(client.stockChannel);
          if (targetChannel) {
            const content = foundHighTier.length > 0 ? `<@&${pingRoleId}> 🚨 **LEGENDARY/MYTHIC IN STOCK!**` : "";
            await targetChannel.send({ content, embeds: [stockEmbed] });
          }
        } catch (err) {
          console.error("Stock fetch failed in loop.");
        }
      }, 3600000); 
    }
  },
};
