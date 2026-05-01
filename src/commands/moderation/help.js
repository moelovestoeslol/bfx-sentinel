const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Displays the Sentinel Commands',
  async execute(message, args, client) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL COMMANDS 」')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('*Advanced protection architecture for BFX STOCKS Services.*')
      .addFields(
        { 
          name: '🛡️ OWNER ONLY (Elite Trio)', 
          value: 
            `\`?automod on/off\` — Toggle security\n` +
            `\`?automod wl/remove @user\` — Manage whitelist\n` +
            `\`?enablestock #channel\` — Setup auto-stock updates\n` +
            `\`?disablestock\` — Stop auto-stock updates`, 
          inline: false 
        },
        { 
          name: '⚔️ MODERATION', 
          value: 
            `\`?ban\` / \`?timeout\`\n` +
            `\`?warn\` / \`?warnings\`\n` +
            `\`?clearwarnings\``, 
          inline: false 
        },
        { 
          name: '🍎 BLOX FRUITS', 
          value: `\`?stock\` — Manual stock check`, 
          inline: true 
        },
        { 
          name: '✨ FUN', 
          value: `\`?rape\` — Restricted Use`, 
          inline: true 
        },
        { 
          name: '⚙️ SYSTEM', 
          value: `\`?help\` — View this guide`, 
          inline: false 
        }
      )
      .setFooter({ 
        text: 'The Sentinel™ v2.0', 
        iconURL: client.user.displayAvatarURL() 
      });

    if (message.reply) {
      await message.reply({ embeds: [helpEmbed] });
    } else {
      await message.editReply({ embeds: [helpEmbed], components: [] });
    }
  },
};
