const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clearwarnings',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to clear warnings.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to clear warnings for.');

    const key = `${message.guild.id}-${target.user.id}`;
    client.warnings.delete(key);

    message.reply(`✅ Cleared all warnings for **${target.user.tag}**.`);
  },
};
