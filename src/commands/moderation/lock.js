const { PermissionsBitField, EmbedBuilder } = require('discord.js');

const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];

module.exports = {
    name: 'lock',
    description: 'Lock a specific channel',
    async execute(message, args, client) {
        const isOwnerRole = message.member.roles.cache.some(role => role.name.toLowerCase() === 'owner');
        if (!eliteTrio.includes(message.author.id) && !isOwnerRole) {
            return message.reply('❌ Unauthorized.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: false
            });

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔒 Channel Locked')
                .setDescription(`This channel has been secured by ${message.author}.`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.reply('❌ Failed to lock channel.');
        }
    },
};
