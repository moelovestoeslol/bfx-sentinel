const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'kick',
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member')
    .addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(context, arg1) {
    const isSlash = !!context.isChatInputCommand?.();
    const args = isSlash ? [] : arg1;
    const moderator = isSlash ? context.user : context.author;

    if (!context.member.permissions.has(PermissionFlagsBits.KickMembers)) return context.reply('❌ No permission.');

    const target = isSlash ? context.options.getMember('target') : context.mentions.members.first();
    const reason = (isSlash ? context.options.getString('reason') : args.slice(1).join(' ')) || 'No reason provided';

    if (!target) return context.reply('❌ Provide a user.');
    if (target.id === moderator.id) return context.reply('❌ You cannot kick yourself.');
    if (eliteTrio.includes(target.id)) return context.reply('❌ **ACCESS DENIED** | Owners cannot be kicked.');
    if (!target.kickable) return context.reply('❌ I cannot kick this user.');

    const dmEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL EXPULSION 」')
      .setDescription(`You have been kicked from **${context.guild.name}**.`)
      .addFields({ name: '📝 Reason', value: reason })
      .setFooter({ text: 'Sentinel™ Security' });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);
    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('👟 Member Kicked')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${moderator.tag}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
