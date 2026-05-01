const { PermissionsBitField, EmbedBuilder } = require('discord.js');

// The Elite Trio IDs
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'lockdown',
  description: 'Emergency server-wide silence',
  async execute(message, args, client) {
    // Check if the user is part of the Elite Trio
    if (!eliteTrio.includes(message.author.id)) {
      return message.reply('❌ This is an emergency command. Access Denied.');
    }

    const channels = message.guild.channels.cache.filter(c => c.isTextBased());
    
    const lockEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('🚨 EMERGENCY SERVER LOCKDOWN')
      .setDescription('All channels have been locked. Stay calm while we secure the system.')
      .setTimestamp();

    try {
      await message.reply('🛑 **Initiating Lockdown...**');

      for (const [id, channel] of channels) {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SendMessages: false,
          AddReactions: false
        }).catch(err => console.error(`Could not lock ${channel.name}`));
      }

      await message.channel.send({ embeds: [lockEmbed] });
      console.log(`Lockdown initiated by ${message.author.tag}`);
      
    } catch (error) {
      console.error(error);
      message.reply('❌ Critical failure during lockdown. Check Bot Permissions.');
    }
  },
};
