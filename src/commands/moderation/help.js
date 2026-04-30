const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Displays the Sentinel Command Codex',
  async execute(message, args, client) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL COMMANDS 」')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('*Advanced protection architecture for BFX STOCKS Services.*')
      .addFields(
        { 
          name: '🛡️ OWNER ONLY (Sentinel Guard)', 
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
            `\`?ban\` / \`/ban\` — Terminate access\n` +
            `\`?timeout\` / \`/timeout\` — Temporary silence\n` +
            `\`?warn\` / \`/warn\` — Log violation\n` +
            `\`?warnings\` / \`/warnings\` — View history\n` +
            `\`?clearwarnings\` / \`/clearwarnings\` — Wipe history`, 
          inline: false 
        },
        { 
          name: '⚙️ SYSTEM', 
          value: 
            `\`?prefix [symbol]\` — Change system prefix\n` +
            `\`?help\` / \`/help\` — View this codex`, 
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
