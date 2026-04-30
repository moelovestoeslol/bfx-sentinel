const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

// Safety net to prevent double-processing
const processedMessages = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // 1. Basic checks
    if (message.author.bot || !message.guild) return;

    // 2. Deduplication Safety Net
    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);
    setTimeout(() => processedMessages.delete(message.id), 3000);

    // 3. Handle Prefix Commands (?ban, ?kick, etc.)
    if (message.content.startsWith(client.prefix)) {
      const args = message.content.slice(client.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);

      if (command) {
        try {
          await command.execute(message, args, client);
        } catch (error) {
          console.error(`Error executing ${commandName}:`, error);
          await message.reply('❌ An error occurred while executing that command.').catch(() => null);
        }
        return; 
      }
    }

    // 4. Handle Mentions/Replies for the Branding Menu
    const isMentioned = message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`);
    const isReplyToBot = message.reference && 
                         (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author.id === client.user.id;

    if (isReplyToBot || isMentioned) {
      const replyEmbed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle(`[ BFX STOCKS Services ]`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `🌟 **Hey** ${message.author}\n` +
          `➡️ **Prefix For This Server:** \`${client.prefix}\`\n\n` +
          `*Type \`${client.prefix}help\` for more information.*`
        )
        .setFooter({ text: 'Powered by The Sentinel™', iconURL: client.user.displayAvatarURL() });

      const menu = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Start With The Sentinel')
            .addOptions([
              { label: 'Help', description: 'Show every command available', value: 'show_help', emoji: '📋' },
              { label: 'Developer', description: 'View the elite team behind the bot', value: 'show_dev', emoji: '🛡️' }
            ]),
        );

      await message.reply({ embeds: [replyEmbed], components: [menu] }).catch(() => null);
    }
  },
};
