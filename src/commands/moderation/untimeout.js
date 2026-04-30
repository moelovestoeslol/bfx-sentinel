const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'untimeout',
  async execute(message, args, client) {
    // 1. Permission Check
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to manage timeouts.');

    // 2. Find User
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    if (!target) return message.reply('❌ Please mention a user or provide a valid User ID.');

    // 3. Elite Trio & Self Logic
    if (target.id === message.author.id) return message.reply('❌ You cannot untimeout yourself.');
    if (eliteTrio.includes(target.id)) return message.reply('❌ **ACCESS DENIED** | Owners are managed by higher-level protocols.');

    try {
      // 4. Send DM Notification First
      const dmEmbed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle('「 SENTINEL RESTORATION 」')
        .setDescription(`Your communication privileges have been restored in **${message.guild.name}**.`)
        .addFields({ name: '🔊 Status', value: 'You have been unmuted.' })
        .setFooter({ text: 'Sentinel™ Security' });

      await target.send({ embeds: [dmEmbed] }).catch(() => null);

      // 5. Execute Untimeout
      await target.timeout(null);

      // 6. Confirmation Embed
      const embed = new EmbedBuilder()
        .setColor(0x010101)
        .setTitle('🔊 Timeout Removed')
        .setDescription(`**${target.user.tag}** is no longer timed out.`)
        .addFields({ name: 'Moderator', value: `${message.author.tag}`, inline: true })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ I cannot remove the timeout for this user. Check my role position.');
    }
  },
};
