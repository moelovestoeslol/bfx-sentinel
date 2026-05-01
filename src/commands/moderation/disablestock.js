const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
  name: 'disablestock',
  async execute(message, args, client) {
    if (!eliteTrio.includes(message.author.id)) return message.reply('❌ Unauthorized.');
    
    client.stockChannel = null;
    message.reply('✅ Blox Fruits stock updates have been disabled.');
  },
};
