const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const timeUnits = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

module.exports = {
  name: 'timeout',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to timeout members.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to timeout.');

    const durationArg = args[1];
    if (!durationArg) return message.reply(`❌ Example: \`${client.prefix}timeout @user 10m\``);

    const unit = durationArg.slice(-1);
    const amount = parseInt(durationArg.slice(0, -1));

    if (!timeUnits[unit] || isNaN(amount) || amount <= 0)
      return message.reply('❌ Invalid duration. Use: `10s`, `5m`, `2h`, `1d`');

    const ms = amount * timeUnits[unit];
    if (ms > 28 * 86400000) return message.reply('❌ Timeout cannot exceed 28 days.');

    const reason = args.slice(2).join(' ') || 'No reason provided';
    await target.timeout(ms, reason);

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle('⏱️ Member Timed Out')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Duration', value: durationArg, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
