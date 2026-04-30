const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'purge',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return message.reply('❌ You do not have permission to manage messages.');

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100)
      return message.reply('❌ Please provide a number between 1 and 100.');

    await message.delete();
    const deleted = await message.channel.bulkDelete(amount, true);

    const confirm = await message.channel.send(`🗑️ Deleted **${deleted.size}** message(s).`);
    setTimeout(() => confirm.delete().catch(() => {}), 3000);
  },
};
