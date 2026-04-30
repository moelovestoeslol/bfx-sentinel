const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unban',
  async execute(message, args, client) {
    // Permission Check
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply('❌ You do not have permission to unban members.');

    const userId = args[0];
    if (!userId) return message.reply('❌ Please provide the User ID to unban.');

    try {
      await message.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setColor(0x000000) // Monochrome style
        .setTitle('🔓 Member Unbanned')
        .setDescription(`Successfully unbanned User ID: \`${userId}\``)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ I couldn’t unban that ID. Make sure it’s correct and they are actually banned.');
    }
  },
};
