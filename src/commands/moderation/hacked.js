const { eliteTrio } = require('../../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'hacked',
    description: 'Auto-purge a specific user',
    execute(message, args) {
        // 1. Permission Check
        if (!eliteTrio.includes(message.author.id)) return message.reply("❌ No perms.");

        const target = message.mentions.users.first();
        const configPath = path.join(__dirname, '../../config.json');
        let config = JSON.parse(fs.readFileSync(configPath));

        // 2. Handle Remove
        if (args[0] === 'remove') {
            config.purgeMode = 0;
            config.hackedUser = "";
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply("✅ Target removed. Purge disabled.");
        }

        // 3. Handle Add
        if (!target) return message.reply("⚠️ Mention a user: `?hacked @user` or use `?hacked remove`.");

        config.purgeMode = 1;
        config.hackedUser = target.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        message.reply(`🎯 **Target Locked:** ${target.tag}'s messages will be auto-purged.`);
    }
};
