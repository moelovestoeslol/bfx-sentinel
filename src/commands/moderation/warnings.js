const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'warnings',
  description: 'Check total warnings for a user',
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Check total warnings for a user')
    .addUserOption(option => option.setName('target').setDescription('The user to check').setRequired(true)),

  async execute(context, args, client) {
    const target = context.options?.getUser('target') || 
                   context.mentions?.users.first() || 
                   (args && args[0] ? await client.users.fetch(args[0]).catch(() => null) : null);

    if (!target) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setDescription('❌ Please mention a valid user to check warnings.');
      return context.reply ? context.reply({ embeds: [errorEmbed] }) : context.channel.send({ embeds: [errorEmbed] });
    }

    const userWarnings = client.warnings.get(target.id) || [];
    const totalWarnings = userWarnings.length;

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle(`⚠️ Warnings for ${target.tag}`)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(`**Total Warnings:** \`${totalWarnings}\``)
      .addFields(
        { 
          name: 'History', 
          value: totalWarnings > 0 
            ? userWarnings.map((w, i) => `**${i + 1}.** ${w.reason} (By: ${w.moderator})`).join('\n') 
            : 'This user has a clean record!' 
        }
      )
      .setFooter({ text: 'The Sentinel™ Moderation', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    if (context.reply) {
      return await context.reply({ embeds: [embed] });
    } else {
      return await context.channel.send({ embeds: [embed] });
    }
  },
};
