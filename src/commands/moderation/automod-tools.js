const { EmbedBuilder } = require('discord.js');

const authorized = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'automod',
  async execute(message, args, client) {
    if (!authorized.includes(message.author.id)) {
      return message.reply('❌ **Missing Permissions:** This is an Owner-Only command.');
    }

    const subCommand = args[0]?.toLowerCase();

    if (subCommand === 'on') {
      client.autoModEnabled = true;
      return message.reply('✅ **Auto-Mod Enabled.**');
    }

    if (subCommand === 'off') {
      client.autoModEnabled = false;
      return message.reply('🛑 **Auto-Mod Disabled.**');
    }

    if (subCommand === 'wl') {
      const target = message.mentions.users.first() || await client.users.fetch(args[1]).catch(() => null);
      if (!target) return message.reply('Use: `?automod wl @user`');
      client.whitelistedUsers.add(target.id);
      return message.reply(`⚪ ${target.tag} has been whitelisted from Auto-Mod.`);
    }
  },
};
