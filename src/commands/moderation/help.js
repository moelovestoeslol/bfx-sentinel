const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Displays the Sentinel Command Codex',
  async execute(message, args, client) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL COMMAND CODEX 」')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('*Advanced protection and utility for BFX STOCKS Services.*')
      .addFields(
        { 
          name: '🛡️ OWNER ONLY (Sentinel Guard)', 
          value: 
            `**Control:** \`?automod on\` | \`?automod off\`\n` +
            `**Whitelist:** \`?automod wl @user\`\n` +
            `**De-list:** \`?automod remove @user\`\n` +
            `*Slash commands available for all above.*`, 
          inline: false 
        },
        { 
          name: '⚙️ CONFIGURATION & INFO', 
          value: 
            `\`?prefix [symbol]\` - Change system prefix\n` +
            `\`?help\` - Show this codex\n` +
            `\`/help\` - Access interactive slash help`, 
          inline: false 
        },
        {
          name: '📋 GENERAL UTILITY',
          value:
            `\`?ban\` | \`?kick\` | \`?warn\`\n` +
            `*Standard moderation suite active.*`,
          inline: false
        }
      )
      .setFooter({ 
        text: 'The Sentinel™ | Pure Performance', 
        iconURL: client.user.displayAvatarURL() 
      });

    // Handle both Prefix and Interaction (Menu) calls
    if (message.reply) {
      await message.reply({ embeds: [helpEmbed] });
    } else {
      // This part ensures it works when users click 'Help' in the branding menu
      await message.editReply({ embeds: [helpEmbed], components: [] });
    }
  },
};
