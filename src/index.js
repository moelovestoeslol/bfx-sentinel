const { Client, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.prefix = process.env.PREFIX || '?';
client.warnings = new Map();

// --- 1. Load Commands ---
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);
const slashCommandsJSON = [];

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    client.commands.set(command.name, command);
    
    if (command.data) {
        slashCommandsJSON.push(command.data.toJSON());
    }
  }
}

// --- 2. Register Slash Commands ---
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: slashCommandsJSON },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// --- 3. Interaction Handler (Slash & Menus) ---
client.on('interactionCreate', async interaction => {
  // Handle Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  }

  // Handle Help Select Menu
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'help_menu' && interaction.values[0] === 'show_help') {
      const helpCommand = client.commands.get('help');
      if (helpCommand) {
        await helpCommand.execute(interaction, [], client);
      } else {
        await interaction.reply({ content: "Help command not found!", ephemeral: true });
      }
    }
  }
});

// --- 4. Reply Detection (The "Nexus Hitler" Replacement) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Check if the message is a reply to the bot
    const isReplyToBot = message.reference && 
                         (await message.channel.messages.fetch(message.reference.messageId)).author.id === client.user.id;

    if (isReplyToBot) {
        const replyEmbed = new EmbedBuilder()
            .setColor(0x010101) 
            .setTitle(`[ BFX STOCKS Services ]`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                `🌟 **Hey** ${message.author}\n` +
                `➡️ **Prefix For This Server:** \`${client.prefix}\`\n\n` +
                `*Type \`${client.prefix}help\` for more information.*`
            )
            .setFooter({ 
                text: 'Powered by The Sentinel™', 
                iconURL: client.user.displayAvatarURL() 
            });

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('Start With The Sentinel')
                    .addOptions([
                        {
                            label: 'Help',
                            description: 'Show every command available',
                            value: 'show_help',
                            emoji: '📋',
                        },
                    ]),
            );

        await message.reply({ embeds: [replyEmbed], components: [menu] });
    }
});

// --- 5. Load Events ---
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.TOKEN);
