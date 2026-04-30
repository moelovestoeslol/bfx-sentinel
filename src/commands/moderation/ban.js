const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bans a member',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server')
    .addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const args = isSlash ? [] : arg1;

    // Check Permissions
    if (!context.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      const errorMsg = '❌ You do not have permission to ban members.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    // Get Target & Reason
    const target = isSlash ? context.options.getMember('target') : context.mentions.members.first();
    const reason = isSlash ? context.options.getString('reason') : args.slice(1).join(' ');
    const finalReason = reason || 'No reason provided';

    if (!target) return isSlash ? context.reply({ content: '❌ Please provide a user to ban.', ephemeral: true }) : context.reply('❌ Please mention a user to ban.');
    if (!target.bannable) return isSlash ? context.reply({ content: '❌ I cannot ban that user.', ephemeral: true }) : context.reply('❌ I cannot ban that user.');

    // Execute
    await target.ban({ reason: finalReason, deleteMessageSeconds: 604800 });

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${isSlash ? context.user.tag : context.author.tag}`, inline: true },
        { name: 'Reason', value: finalReason }
      )
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
