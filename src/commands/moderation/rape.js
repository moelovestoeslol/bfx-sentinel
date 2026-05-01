module.exports = {
    name: 'rape',
    description: 'rape a member',
    async execute(message, args, client) {
        // --- settings for da template ---
        const mode = 1; // 1: Owners, 2: specific roles only, 3: everyone
        const rolID = '1499709607545671741'; // id of role bot take or leave
        
        const ownerIDs = ['1424300320967884811', '1479660280555376853', '1014550997072347137']; 
        const authorizedRoles = ['1499724955678543963']; 
        // ---------------------

        const executor = message.member;
        let hasPerms = false;

        // verify who executed this
        if (mode === 1) {
            if (ownerIDs.includes(message.author.id)) hasPerms = true;
        } else if (mode === 2) {
            if (executor.roles.cache.some(role => authorizedRoles.includes(role.id))) hasPerms = true;
        } else if (mode === 3) {
            hasPerms = true;
        }

        if (!hasPerms) return message.reply('no perms LOL.');

        // search  for user mention or ID in args
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!targetMember) {
            return message.reply('you need to mention a user or provide their ID. Example: `?rape @user` or `?rape userID`');
        }

        const targetRole = message.guild.roles.cache.get(rolID);
        if (!targetRole) return message.reply('Error 69 role id not found, Contact Nuh.');

        try {
            if (targetMember.roles.cache.has(rolID)) {
                await targetMember.roles.remove(targetRole);
                message.reply(`**${targetMember.user.tag}** got rapedn't.`);
            } else {
                await targetMember.roles.add(targetRole);
                message.reply(`**${targetMember.user.tag}** got raped.`);
            }
        } catch (err) {
            console.error(err);
            message.reply('Error 67 contact nuh');
        }
    },
};
