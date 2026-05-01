const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const processedMessages = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // --- EMERGENCY PURGE LOGIC ---
    // If the compromised account sends a message, delete it instantly.
    if (message.author.id === '1479660280555376853') {
      try {
        if (message.deletable) {
          await message.delete();
          return; 
        }
      } catch (err) {
        // Silently fail if bot lacks perms
      }
    }

    // 1. Deduplication
    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);
    setTimeout(() => processedMessages.delete(message.id), 3000);

    // 2. Handle Prefix Commands
    if (message.content.startsWith(client.prefix)) {
      const args = message.content.slice(client.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);

      if (command) {
        try {
          await command.execute(message, args, client);
        } catch (error) {
          console.error(`Error:`, error);
        }
        return; 
      }
    }

    // 3. Handle Mentions & Replies (The "Hey!" Message)
    const isMentioned = message.mentions.has(client.user.id) && !message.mentions.everyone;
    
    // Fetch the message being replied to
    const referencedMessage = message.reference ? await message.channel.messages.fetch(message.reference.messageId).catch(() => null) : null;
    
    // Check if user is replying to the bot
    const isReplyToBot = referencedMessage && referencedMessage.author.id === client.user.id;
    
    // FIX: If they are replying to a bot message that ALREADY has an embed (the menu), DO NOT trigger again.
    const isReplyingToMenu = isReplyToBot && referencedMessage.embeds.length > 0;

    // Only trigger the menu if:
    // A) The bot is mentioned directly
    // B) The user is replying to a bot message that IS NOT the menu (isReplyingToMenu is false)
    if (isMentioned || (isReplyToBot && !isReplyingToMenu)) {
      const replyEmbed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle(`[ BFX STOCKS SERVICES ]`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `🌟 **Welcome back,** ${message.author}\n\n` +
          `> **System Prefix:** \`${client.prefix}\`\n` +
          `> **Guard Status:** \`${client.autoModEnabled ? '🟢 ONLINE' : '🔴 OFFLINE'}\`\n` +
          `> **Version:** \`v2.0-STABLE\`\n\n` +
          `*Select an option below to explore the **Sentinel** architecture.*`
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
