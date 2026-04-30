module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📌 Prefix: ${client.prefix}`);
    client.user.setActivity(`${client.prefix}help | Moderating`, { type: 3 });
  },
};
