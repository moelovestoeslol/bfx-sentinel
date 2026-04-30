const { EmbedBuilder } = require('discord.js');

const BANNED_WORDS = ['fuck', 'rape', 'nigga', 'niga', 'nigger', 'jew', 'fucker', 'bitch', 'ass', 'slut', 'cunt', 'fucking', 'fuckass', 'fuckkyou'];
const messageLog = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (!client.autoModEnabled || message.author.bot || !message.guild) return;
    if (client.whitelistedUsers.has(message.author.id)) return;

    const content = message.content;
    const member = message.member;

    // --- 1. BANNED WORDS ---
    if (BANNED_WORDS.some(word => content.toLowerCase().includes(word))) {
      await message.delete().catch(() => null);
      return message.channel.send(`⚠️ ${message.author}, watch your language.`).then(m => setTimeout(() => m.delete(), 3000));
    }

    // --- 2. ANTI-LINK / INVITE (15m Mute) ---
    const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+/g;
    const linkRegex = /https?:\/\/\S+/g;
    if (inviteRegex.test(content) || linkRegex.test(content)) {
      await message.delete().catch(() => null);
      await member.timeout(15 * 60 * 1000, 'Sending unauthorized links');
      return message.channel.send(`🛡️ **The Sentinel** has muted ${message.author} for 15m (Links).`);
    }

    // --- 3. MASS PING (12m Mute) ---
    if (message.mentions.users.size > 4 || content.split('<@').length > 5) {
      await message.delete().catch(() => null);
      await member.timeout(12 * 60 * 1000, 'Mass Pinging');
      return message.channel.send(`🛡️ **The Sentinel** has muted ${message.author} for 12m (Mass Ping).`);
    }

    // --- 4. EXCESSIVE CAPS (1m Mute) ---
    const capsMatch = content.replace(/[^A-Z]/g, "").length;
    if (content.length > 10 && (capsMatch / content.length) > 0.7) {
      await message.delete().catch(() => null);
      await member.timeout(1 * 60 * 1000, 'Excessive Caps');
      return message.channel.send(`🛡️ **The Sentinel** has muted ${message.author} for 1m (Caps).`);
    }

    // --- 5. ANTI-SPAM (7m Mute) ---
    const now = Date.now();
    const userData = messageLog.get(message.author.id) || [];
    userData.push(now);
    const recentMessages = userData.filter(time => now - time < 5000); // Messages in last 5s
    messageLog.set(message.author.id, recentMessages);

    if (recentMessages.length > 5) {
      await message.delete().catch(() => null);
      await member.timeout(7 * 60 * 1000, 'Chat Spamming');
      return message.channel.send(`🛡️ **The Sentinel** has muted ${message.author} for 7m (Spam).`);
    }
  },
};
