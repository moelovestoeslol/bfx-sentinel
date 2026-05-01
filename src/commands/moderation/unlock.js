const { PermissionsBitField, EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
    name: 'unlock',
    description: 'Unlock a specific channel',
    async execute(message, args, client) {
        const isOwnerRole = message.member.roles.cache.some(role => role.name.toLowerCase() === 'owner');
        
        if (!eliteTrio.includes(message.author.id) && !isOwnerRole) {
            return message.reply('❌ Unauthorized.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: true
            });

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🔓 Channel Unlocked')
                .setDescription(`Chat permissions have been restored by ${message.author}.`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.reply('❌ Failed to unlock channel.');
        }
    },
};
