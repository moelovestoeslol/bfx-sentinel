const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all bot commands',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of all moderation commands'),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const client = isSlash ? arg1 : arg2;
    const authorTag = isSlash ? context.user.tag : context.author.tag;

    const embed = new EmbedBuilder()
      .setColor(0x000000)
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
            `> \`/clearwarnings\` or \`${client.prefix}clearwarnings @user\``,
          ].join('\n'),
        },
        { name: 'ℹ️ General', value: `> \`/help\` or \`${client.prefix}help\`` }
      )
      .setFooter({ text: `Requested by ${authorTag}` })
      .setTimestamp();

    await context.reply({ embeds: [embed] });
  },
};
