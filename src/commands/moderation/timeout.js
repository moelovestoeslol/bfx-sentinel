const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const timeUnits = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'timeout',
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
    const moderator = isSlash ? context.user : context.author;

    if (!context.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return context.reply('❌ No permission.');

    const target = isSlash ? context.options.getMember('target') : context.mentions.members.first();
    const durationArg = isSlash ? context.options.getString('duration') : args[1];
    
    if (!target) return context.reply('❌ Provide a user.');
    
    // Protection
    if (target.id === moderator.id) return context.reply('❌ You cannot mute yourself.');
    if (eliteTrio.includes(target.id)) return context.reply('❌ **ACCESS DENIED** | Owners cannot be silenced.');

    const unit = durationArg?.slice(-1).toLowerCase();
    const amount = parseInt(durationArg?.slice(0, -1));

    if (!timeUnits[unit] || isNaN(amount)) return context.reply('❌ Invalid duration (10s, 5m, 1h).');

    const ms = amount * timeUnits[unit];
    const reason = (isSlash ? context.options.getString('reason') : args.slice(2).join(' ')) || 'No reason provided';

    // DM Notification
    const dmEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL RESTRICTION 」')
      .setDescription(`Your communication has been restricted in **${context.guild.name}**.`)
      .addFields(
        { name: '⏳ Duration', value: durationArg, inline: true },
        { name: '📝 Reason', value: reason, inline: true }
      )
      .setFooter({ text: 'Sentinel™ Security' });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);

    await target.timeout(ms, reason);

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('⏱️ Member Timed Out')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${moderator.tag}`, inline: true },
        { name: 'Duration', value: durationArg, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
