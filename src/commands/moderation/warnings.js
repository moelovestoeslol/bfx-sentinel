const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'warnings',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to view warnings.');

    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to check warnings.');

    const key = `${message.guild.id}-${target.user.id}`;
    const userWarnings = client.warnings.get(key) || [];

    if (userWarnings.length === 0) {
      return message.reply(`✅ ${target.user.tag} has no warnings.`);
    }

    const warnList = userWarnings
      .map((w, i) => `**${i + 1}.** ${w.reason} — by ${w.mod}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xffaa00)
      .setTitle(`⚠️ Warnings for ${target.user.tag}`)
      .setDescription(warnList)
      .setFooter({ text: `Total: ${userWarnings.length} warning(s)` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
