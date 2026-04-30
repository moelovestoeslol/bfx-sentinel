const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers))
      return message.reply('❌ You do not have permission to kick members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to kick.');
    if (!target.kickable) return message.reply('❌ I cannot kick that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0xff6600)
      .setTitle('👟 Member Kicked')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
