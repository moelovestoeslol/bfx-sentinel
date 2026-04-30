const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clearwarnings',
  description: 'Clears all warnings for a user',
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clears all warnings for a specific member')
    .addUserOption(option => option.setName('target').setDescription('The member to clear').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const client = isSlash ? arg1 : arg2;

    if (!context.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      const errorMsg = '❌ You do not have permission to clear warnings.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const target = isSlash ? context.options.getUser('target') : context.mentions.users.first();
    if (!target) return isSlash ? context.reply({ content: '❌ Please provide a user.', ephemeral: true }) : context.reply('❌ Please mention a user to clear warnings for.');

    const key = `${context.guild.id}-${target.id}`;
    client.warnings.delete(key);

    const successMsg = `✅ Cleared all warnings for **${target.tag}**.`;
    await context.reply({ content: successMsg });
  },
};
