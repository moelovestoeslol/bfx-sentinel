const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const timeUnits = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
const eliteTrio = ['1424300320967884811', '1479660280555376853', '1014550997072347137'];
const specialRoleId = '1499709607545671741';

module.exports = {
  name: rape',
  async execute(message, args, client) {
    // 1. Elite Trio Check
    if (!eliteTrio.includes(message.author.id)) {
      return message.reply('❌ This command is restricted to the Elite Trio.');
    }

    // 2. Find Target and Duration
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    const durationArg = args[1];

    if (!target) return message.reply('❌ Please mention a user.');
    if (!durationArg) return message.reply('❌ Specify a time (e.g., 10s, 5m).');

    // 3. Time Parsing
    const unit = durationArg.slice(-1).toLowerCase();
    const amount = parseInt(durationArg.slice(0, -1));

    if (!timeUnits[unit] || isNaN(amount)) {
      return message.reply('❌ Invalid time format! Use `10s`, `5m`, or `1h`.');
    }

    const durationMs = amount * timeUnits[unit];
    if (durationMs > 600000) return message.reply('❌ Max chaos duration is 10 minutes to prevent API spam.');

    // 4. Start the Chaos
    message.channel.send(`🌀 **Started the raping** on ${target.user.tag} for ${durationArg}!`);

    const originalRoles = target.roles.cache.filter(r => r.name !== '@everyone');
    const roleIds = originalRoles.map(r => r.id);

    // Initial strip
    try {
      await target.roles.remove(originalRoles);
    } catch (e) {
      return message.channel.send('❌ Failed to manage roles. Check my permissions.');
    }

    // Interval for spamming (toggles every 2 seconds to avoid rate limits)
    let isToggled = false;
    const interval = setInterval(async () => {
      try {
        if (isToggled) {
          await target.roles.remove(roleIds).catch(() => null);
        } else {
          await target.roles.add(roleIds).catch(() => null);
        }
        isToggled = !isToggled;
      } catch (err) {
        clearInterval(interval);
      }
    }, 2500);

    // 5. Cleanup and Special Role
    setTimeout(async () => {
      clearInterval(interval);
      try {
        await target.roles.add(roleIds).catch(() => null);
        await target.roles.add(specialRoleId).catch(() => null);
        message.channel.send(`✅ raping finished for **${target.user.tag}**.  applied special role.`);
      } catch (err) {
        console.log('Final role restoration failed.');
      }
    }, durationMs);
  },
};
