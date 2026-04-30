const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'ban',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member')
    .addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(context, arg1) {
    const isSlash = !!context.isChatInputCommand?.();
    const args = isSlash ? [] : arg1;
    const moderator = isSlash ? context.user : context.author;

    if (!context.member.permissions.has(PermissionFlagsBits.BanMembers)) return context.reply('❌ No permission.');

    const target = isSlash ? context.options.getMember('target') : context.mentions.members.first();
    const reason = (isSlash ? context.options.getString('reason') : args.slice(1).join(' ')) || 'No reason provided';

    if (!target) return context.reply('❌ Provide a user.');
    if (target.id === moderator.id) return context.reply('❌ You cannot ban yourself.');
    if (eliteTrio.includes(target.id)) return context.reply('❌ **FATAL ERROR** | Termination of an Owner is strictly prohibited.');
    if (!target.bannable) return context.reply('❌ I cannot ban this user.');

    const dmEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL TERMINATION 」')
      .setDescription(`Your access to **${context.guild.name}** has been permanently revoked.`)
      .addFields({ name: '📝 Reason', value: reason })
      .setFooter({ text: 'Sentinel™ Security' });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);
    await target.ban({ reason: reason, deleteMessageSeconds: 604800 });

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${moderator.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
