const { PermissionsBitField, EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'lockdown',
  description: 'Emergency server-wide silence',
  async execute(message, args, client) {
    if (!eliteTrio.includes(message.author.id)) {
      return message.reply('❌ This is an emergency command. Access Denied.');
    }

    const msg = await message.reply('🛑 **Initiating Lockdown...**');

    try {
      // Filter for text channels the bot actually has permission to manage
      const channels = message.guild.channels.cache.filter(c => 
        c.isTextBased() && 
        c.viewable && 
        c.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageRoles)
      );

      for (const [id, channel] of channels) {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SendMessages: false,
          AddReactions: false
        }).catch(() => console.log(`Skipped ${channel.name}`));
      }

      const lockEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🚨 EMERGENCY SERVER LOCKDOWN')
        .setDescription('All public channels have been locked by the Elite Trio.')
        .setTimestamp()
        .setFooter({ text: 'Sentinel™ Security System' });

      await msg.edit({ content: '✅ **Lockdown Complete.**', embeds: [lockEmbed] });
      
    } catch (error) {
      console.error("Lockdown Error:", error);
      await msg.edit('❌ **Critical Error:** Check bot logs in Railway.');
    }
  },
};
