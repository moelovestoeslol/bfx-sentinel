const { EmbedBuilder } = require('discord.js');

// Authorized IDs: Nuh, Karan, and wtreboi
const authorized = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'automod', // This is the command you type (e.g., ?automod)
  description: 'Manage the Sentinel Guard system',
  async execute(message, args, client) {
    // Permission Check for the Elite Trio
    if (!authorized.includes(message.author.id)) {
      return message.reply({ 
        embeds: [new EmbedBuilder().setColor(0x010101).setDescription('❌ **ACCESS DENIED** | This is an Owner-Only command.')] 
      });
    }

    const subCommand = args[0]?.toLowerCase();
    const embed = new EmbedBuilder().setColor(0x010101).setFooter({ text: 'Sentinel™ Security' });

    // 1. ?automod on
    if (subCommand === 'on') {
      client.autoModEnabled = true;
      embed.setTitle('🛡️ SYSTEM ONLINE').setDescription('The Sentinel Guard is now **Active** and monitoring chat.');
      return message.reply({ embeds: [embed] });
    }

    // 2. ?automod off
    if (subCommand === 'off') {
      client.autoModEnabled = false;
      embed.setTitle('🛑 SYSTEM OFFLINE').setDescription('The Sentinel Guard has been **Disabled**.');
      return message.reply({ embeds: [embed] });
    }

    // 3. ?automod wl @user
    if (subCommand === 'wl') {
      const target = message.mentions.users.first() || await client.users.fetch(args[1]).catch(() => null);
      if (!target) return message.reply('Usage: `?automod wl @user`');
      
      client.whitelistedUsers.add(target.id);
      embed.setTitle('⚪ WHITELIST ADDED').setDescription(`**${target.tag}** is now immune to Auto-Mod filters.`);
      return message.reply({ embeds: [embed] });
    }

    // 4. ?automod remove @user
    if (subCommand === 'remove') {
      const target = message.mentions.users.first() || await client.users.fetch(args[1]).catch(() => null);
      if (!target) return message.reply('Usage: `?automod remove @user`');
      
      if (client.whitelistedUsers.has(target.id)) {
        client.whitelistedUsers.delete(target.id);
        embed.setTitle('🌑 WHITELIST REMOVED').setDescription(`**${target.tag}** has been stripped of immunity.`);
      } else {
        embed.setDescription(`❌ **${target.tag}** is not currently on the whitelist.`);
      }
      return message.reply({ embeds: [embed] });
    }
  },
};
