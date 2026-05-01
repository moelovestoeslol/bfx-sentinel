const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'warnings',
  async execute(message, args, client) {
    // Permission check
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply('❌ You do not have permission to view warnings.');

    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    if (!target) return message.reply('❌ Please mention a user or provide a valid ID to check.');

    const key = `${message.guild.id}-${target.user.id}`;
    const userWarnings = client.warnings.get(key);

    // Check if user has any warns
    if (!userWarnings || userWarnings.length === 0) {
      return message.reply(`✅ **${target.user.tag}** has a clean record (0 warnings).`);
    }

    // Format: 1- Warned for breaking rules auth :youraveragenuh
    const warningList = userWarnings.map((w, index) => {
      return `**${index + 1}-** ${w.reason} | **auth:** ${w.mod}`;
    }).join('\n');

    // Handle long lists (Discord embeds have a 4096 character limit for descriptions)
    // If it's too long, we slice it to prevent the bot from crashing.
    const description = warningList.length > 4000 
      ? warningList.substring(0, 3990) + "... (Too many warns to show)" 
      : warningList;

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle(`📋 Warning History: ${target.user.tag}`)
      .setDescription(description)
      .addFields({ name: 'Total Count', value: `${userWarnings.length}`, inline: true })
      .setTimestamp()
      .setFooter({ text: 'Sentinel™ Security' });

    await message.reply({ embeds: [embed] });
  },
};
