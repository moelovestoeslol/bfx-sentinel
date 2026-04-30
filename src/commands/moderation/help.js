const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📋 BFX Sentinel Commands')
      .setDescription(`Prefix: \`${client.prefix}\``)
      .addFields(
        {
          name: '🔨 Moderation',
          value: [
            `\`${client.prefix}ban @user [reason]\` — Ban a member`,
            `\`${client.prefix}kick @user [reason]\` — Kick a member`,
            `\`${client.prefix}timeout @user <duration> [reason]\` — Timeout a member (10s, 5m, 2h, 1d)`,
            `\`${client.prefix}purge <1-100>\` — Bulk delete messages`,
            `\`${client.prefix}warn @user [reason]\` — Warn a member (auto-timeout at 3)`,
            `\`${client.prefix}warnings @user\` — View a member's warnings`,
            `\`${client.prefix}clearwarnings @user\` — Clear a member's warnings`,
          ].join('\n'),
        },
        { name: 'ℹ️ General', value: `\`${client.prefix}help\` — Show this menu` },
      )
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
