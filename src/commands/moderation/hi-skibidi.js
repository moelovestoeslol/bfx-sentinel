module.exports = {
    name: 'hi',
    description: 'basic greeting',
    async execute(message, args, client) {
        const mode = 1; 
        const ownerIDs = ['1424300320967884811', '147966028055376853', '1014550997072347137', '1285515232478887936']; 

        let hasPerms = false;

        if (mode === 1) {
            if (ownerIDs.includes(message.author.id)) hasPerms = true;
        }

        if (!hasPerms) return message.reply('no perms LOL.');
        // This checks if you typed "?hi skibidi"
        if (args[0] === 'skibidi') {
            message.reply('hi skibidi 👋');
        } else {
            message.reply('hi!');
        }
    },
};
