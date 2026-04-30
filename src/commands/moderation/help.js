const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all bot commands',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of all moderation commands'),

  async execute(context, args, client) {
    // Correctly find the user regardless of how the command was triggered
    const user = context.user || context.member?.user || context.author;
    const authorTag = user ? user.tag : 'User';

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('📋 BFX Sentinel Commands')
      .setDescription(`Prefix: \`${client.prefix}\` (Slash Commands \`/\` are also supported!)`)
      .addFields(
        {
          name: '🔨 Moderation',
          value: [
            `> \`/ban\` or \`${client.prefix}ban @user [reason]\``,
            `> \`/kick\` or \`${client.prefix}kick @user [reason]\``,
            `> \`/timeout\` or \`${client.prefix}timeout @user <duration> [reason]\``,
            `> \`/purge\` or \`${client.prefix}purge <1-100>\``,
            `> \`/warn\` or \`${client.prefix}warn @user [reason]\``,
            `> \`/warnings\` or \`${client.prefix}warnings @user\``,
          ].join('\n'),
        },
        { name: 'ℹ️ General', value: `> \`/help\` or \`${client.prefix}help\`` }
      )
      .setFooter({ text: `Requested by ${authorTag}`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    // Check if context is an interaction (Slash or Menu)
    if (context.isChatInputCommand || context.isStringSelectMenu) {
      if (context.replied || context.deferred) {
        return await context.followUp({ embeds: [embed], ephemeral: true });
      }
      return await context.reply({ embeds: [embed], ephemeral: true });
    } else {
      // It's a standard prefix message
      return await context.channel.send({ embeds: [embed] });
    }
  },
};
