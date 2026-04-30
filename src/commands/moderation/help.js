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
          name: '🛡️ OWNER ONLY', 
          value: 
            `\`?automod on\` / \`/automod on\`\n` +
            `\`?automod off\` / \`/automod off\`\n` +
            `\`?automod wl @user\` / \`/automod wl @user\`\n` +
            `\`?automod remove @user\` / \`/automod remove @user\``, 
          inline: false 
        },
        { 
          name: '⚔️ MODERATION', 
          value: 
            `\`?ban\` / \`/ban\`\n` +
            `\`?timeout\` / \`/timeout\`\n` +
            `\`?warn\` / \`/warn\`\n` +
            `\`?warnings\` / \`/warnings\`\n` +
            `\`?clearwarnings\` / \`/clearwarnings\``, 
          inline: false 
        },
        { 
          name: '⚙️ SYSTEM', 
          value: 
            `\`?help\` / \`/help\` — View this guide`, 
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
