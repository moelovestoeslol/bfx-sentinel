module.exports = {
    name: 'unrape',
    description: 'Stop the process and restore roles',
    async execute(message, args, client) {
        const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];
        const isOwnerRole = message.member.roles.cache.some(role => role.name.toLowerCase() === 'owner');

        if (!eliteTrio.includes(message.author.id) && !isOwnerRole) return;

        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('❌ Mention the target to secure them.');

        // Stop the loop if it exists
        if (client.activeLoops && client.activeLoops.has(target.id)) {
            clearInterval(client.activeLoops.get(target.id));
            client.activeLoops.delete(target.id);
            return message.reply(`🛡️ **System Secured.** Process stopped for ${target.user.tag}.`);
        } else {
            return message.reply('❌ No active process found for this user.');
        }
    },
};
