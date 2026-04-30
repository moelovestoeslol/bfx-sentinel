const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'warn',
  async execute(message, args, client) {
    // 1. Permission Check
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to warn members.');

    // 2. Find User by Mention OR ID
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    if (!target) return message.reply('❌ Please mention a user or provide a valid User ID to warn.');
    if (target.id === message.author.id) return message.reply('❌ You cannot warn yourself.');

    // 3. Get Reason
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const userId = target.user.id;
    const guildId = message.guild.id;
    const key = `${guildId}-${userId}`;

    // 4. Update Warning Map
    if (!client.warnings.has(key)) client.warnings.set(key, []);
    const userWarnings = client.warnings.get(key);
    
    userWarnings.push({ 
        reason, 
        mod: message.author.tag, 
        date: new Date().toLocaleString() 
    });
    
    client.warnings.set(key, userWarnings);
    const warnCount = userWarnings.length;

    // 5. Attempt to DM the user
    try {
      await target.user.send(`⚠️ You have been warned in **${message.guild.name}**\n**Reason:** ${reason}\n**Total warnings:** ${warnCount}`);
    } catch (err) {
      console.log(`Could not DM ${target.user.tag}.`);
    }

    // 6. Send Confirmation Embed
    const embed = new EmbedBuilder()
      .setColor(0x000000) // Your preferred black aesthetic
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${target.user.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Total Warnings', value: `${warnCount}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });

    // 7. Auto-Punishment (3 Warnings = 10m Timeout)
    if (warnCount >= 3) {
      try {
        await target.timeout(10 * 60000, 'Reached 3 warnings');
        message.channel.send(`🚨 **${target.user.tag}** has reached **3 warnings** and has been automatically timed out for 10 minutes.`);
      } catch (err) {
        message.channel.send(`❌ Failed to auto-timeout ${target.user.tag}. Check my role permissions.`);
      }
    }
  },
};
