const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Deletes a number of messages',
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages from a channel')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(context, arg1, arg2) {
    const isSlash = !!context.isChatInputCommand?.();
    const args = isSlash ? [] : arg1;

    if (!context.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const errorMsg = '❌ You do not have permission to manage messages.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    const amount = isSlash ? context.options.getInteger('amount') : parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      const errorMsg = '❌ Please provide a number between 1 and 100.';
      return isSlash ? context.reply({ content: errorMsg, ephemeral: true }) : context.reply(errorMsg);
    }

    // Only try to delete the initial command message if it's a prefix command
    if (!isSlash) {
        await context.delete().catch(() => {});
    } else {
        // Slash commands need to be "deferred" if we are deleting messages so it doesn't say "Interaction Failed"
        await context.deferReply({ ephemeral: true });
    }

    const deleted = await context.channel.bulkDelete(amount, true);
    const successMsg = `🗑️ Deleted **${deleted.size}** message(s).`;

    if (isSlash) {
        await context.editReply({ content: successMsg });
    } else {
        const confirm = await context.channel.send(successMsg);
        setTimeout(() => confirm.delete().catch(() => {}), 3000);
    }
  },
};
