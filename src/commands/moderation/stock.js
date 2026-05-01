const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stock',
  async execute(message, args, client) {
    const loadingEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setDescription('📡 *Fetching live stock data from the Wiki...*');

    const statusMsg = await message.reply({ embeds: [loadingEmbed] });

    try {
      // Pulling from the official community-maintained stock page
      const { data } = await axios.get('https://blox-fruits.fandom.com/wiki/Blox_Fruits_Wiki');
      const $ = cheerio.load(data);
      
      let currentStock = [];
      $('.stock-container .fruit-name').each((i, el) => {
        currentStock.push($(el).text().trim());
      });

      if (currentStock.length === 0) {
        return statusMsg.edit({ content: '⚠️ Could not find stock data. The Wiki layout might have changed.', embeds: [] });
      }

      // Check for High-Tier fruits to highlight them
      const highTier = ["Kitsune", "Leopard", "Dragon", "Spirit", "Control", "Venom", "Shadow", "Dough", "Mammoth", "T-Rex"];
      const highlight = currentStock.filter(f => highTier.includes(f));

      const stockEmbed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle('🍎 CURRENT BLOX FRUITS STOCK')
        .setThumbnail('https://static.wikia.nocookie.net/blox-fruits/images/f/f6/Blox_Fruits_Logo.png')
        .setDescription(`**Normal Stock:**\n${currentStock.join(', ')}`)
        .addFields(
          { name: '⭐ Rare Finds', value: highlight.length > 0 ? highlight.join(', ') : 'None currently in stock', inline: true },
          { name: '⏰ Next Restock', value: 'Check every 4 hours', inline: true }
        )
        .setFooter({ text: 'Sentinel™ Utility | Data via Blox Fruits Wiki' })
        .setTimestamp();

      await statusMsg.edit({ embeds: [stockEmbed] });

    } catch (err) {
      console.error(err);
      await statusMsg.edit({ content: '❌ Failed to connect to the stock services. Try again later.', embeds: [] });
    }
  },
};
