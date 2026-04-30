const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'warn',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to warn members.');

    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    if (!target) return message.reply('❌ Please mention a user or provide a valid User ID.');
    
    // STOP LOGIC: Prevents code from continuing if user is protected
    if (target.id === message.author.id) return message.reply('❌ You cannot warn yourself.');
    if (eliteTrio.includes(target.id)) return message.reply('❌ **ACCESS DENIED** | This user is part of the Elite Trio and cannot be warned.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const key = `${message.guild.id}-${target.user.id}`;

    if (!client.warnings.has(key)) client.warnings.set(key, []);
    const userWarnings = client.warnings.get(key);
    
    userWarnings.push({ 
        reason, 
        mod: message.author.tag, 
        date: new Date().toLocaleString() 
    });
    
    client.warnings.set(key, userWarnings);
    const warnCount = userWarnings.length;

    // DM Notification
    const dmEmbed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('「 SENTINEL WARNING 」')
      .setDescription(`You have received a formal warning in **${message.guild.name}**.`)
      .addFields(
        { name: '📝 Reason', value: reason, inline: true },
        { name: '📊 Total Warnings', value: `${warnCount}`, inline: true }
      )
      .setFooter({ text: 'Sentinel™ Security' });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Total Warnings', value: `${warnCount}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    // Changed to message.reply to ensure it links to the command
    await message.reply({ embeds: [embed] });

    if (warnCount >= 3) {
      try {
        await target.timeout(10 * 60000, 'Reached 3 warnings');
        message.channel.send(`🚨 **${target.user.tag}** has reached **3 warnings** and has been auto-timed out.`);
      } catch (err) {
        console.log(`Failed to auto-timeout ${target.user.tag}.`);
      }
    }
  },
};
