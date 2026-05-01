module.exports = {
    name: 'unrape',
    description: 'Restricted utility command',
    async execute(message, args, client) {
        const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];
        const isOwnerRole = message.member.roles.cache.some(role => role.name.toLowerCase() === 'owner');

        if (!eliteTrio.includes(message.author.id) && !isOwnerRole) return;

        message.reply('🛡️ Target secured. Protection active.');
    },
};
