const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const timeUnits = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

module.exports = {
  name: 'timeout',
  description: 'Timeouts a member',
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout/Mute a member')
    .addUserOption(option => option.setName('target').setDescription('The member to timeout').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Format: 10s, 5m, 2h, 1d').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the timeout'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const args = isSlash ? [] : arg1;
    const client = isSlash ? arg1 : arg2;

    if (!context.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      const errorMsg = '❌ You do not have permission to timeout members.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const target = isSlash ? context.options.getMember('target') : context.mentions.members.first();
    const durationArg = isSlash ? context.options.getString('duration') : args[1];
    
    if (!target) return isSlash ? context.reply({ content: '❌ Please provide a user.', ephemeral: true }) : context.reply('❌ Please mention a user to timeout.');
    if (!durationArg) return isSlash ? context.reply({ content: `❌ Example: \`${client.prefix}timeout @user 10m\``, ephemeral: true }) : context.reply(`❌ Example: \`${client.prefix}timeout @user 10m\``);

    const unit = durationArg.slice(-1).toLowerCase();
    const amount = parseInt(durationArg.slice(0, -1));

    if (!timeUnits[unit] || isNaN(amount) || amount <= 0) {
      const errorMsg = '❌ Invalid duration. Use formats like: `10s`, `5m`, `2h`, `1d`';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const ms = amount * timeUnits[unit];
    if (ms > 28 * 86400000) {
        const errorMsg = '❌ Timeout cannot exceed 28 days.';
        return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const reason = isSlash ? context.options.getString('reason') : args.slice(2).join(' ');
    const finalReason = reason || 'No reason provided';

    await target.timeout(ms, finalReason);

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle('⏱️ Member Timed Out')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${isSlash ? context.user.tag : context.author.tag}`, inline: true },
        { name: 'Duration', value: durationArg, inline: true },
        { name: 'Reason', value: finalReason },
      )
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
