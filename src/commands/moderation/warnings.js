const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'warnings',
  description: 'View a users warnings',
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Check how many warnings a user has')
    .addUserOption(option => option.setName('target').setDescription('The member to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const client = isSlash ? arg1 : arg2;

    if (!context.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      const errorMsg = '❌ You do not have permission to view warnings.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const target = isSlash ? context.options.getUser('target') : context.mentions.users.first();
    if (!target) return isSlash ? context.reply({ content: '❌ Please provide a user.', ephemeral: true }) : context.reply('❌ Please mention a user to check warnings.');

    const key = `${context.guild.id}-${target.id}`;
    const userWarnings = client.warnings.get(key) || [];

    if (userWarnings.length === 0) {
      const msg = `✅ ${target.tag} has no warnings.`;
      return context.reply({ content: msg });
    }

    const warnList = userWarnings
      .map((w, i) => `**${i + 1}.** ${w.reason} — by ${w.mod}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`⚠️ Warnings for ${target.tag}`)
      .setDescription(warnList)
      .setFooter({ text: `Total: ${userWarnings.length} warning(s)` })
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
