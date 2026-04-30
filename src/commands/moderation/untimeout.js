const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'untimeout',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to manage timeouts.');

    // Logic to find user by Mention OR ID
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    if (!target) return message.reply('❌ Please mention a user or provide a valid User ID.');

    try {
      await target.timeout(null);

      const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('🔊 Timeout Removed')
        .setDescription(`**${target.user.tag}** is no longer timed out.`)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ I cannot remove the timeout for this user.');
    }
  },
};
