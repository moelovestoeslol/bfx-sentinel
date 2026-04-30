const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kicks a member',
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member from the server')
    .addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const args = isSlash ? [] : arg1;

    if (!context.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      const errorMsg = '❌ You do not have permission to kick members.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const target = isSlash ? context.options.getMember('target') : context.mentions.members.first();
    const reason = isSlash ? context.options.getString('reason') : args.slice(1).join(' ');
    const finalReason = reason || 'No reason provided';

    if (!target) return isSlash ? context.reply({ content: '❌ Please provide a user to kick.', ephemeral: true }) : context.reply('❌ Please mention a user to kick.');
    if (!target.kickable) return isSlash ? context.reply({ content: '❌ I cannot kick that user.', ephemeral: true }) : context.reply('❌ I cannot kick that user.');

    await target.kick(finalReason);

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle('👟 Member Kicked')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${isSlash ? context.user.tag : context.author.tag}`, inline: true },
        { name: 'Reason', value: finalReason },
      )
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
