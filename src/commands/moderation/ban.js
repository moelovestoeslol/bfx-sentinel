const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply('❌ You do not have permission to ban members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to ban.');
    if (!target.bannable) return message.reply('❌ I cannot ban that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.ban({ reason, deleteMessageSeconds: 604800 });

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
