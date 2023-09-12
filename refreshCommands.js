const yaml = require("js-yaml");
const { REST, Routes } = require('discord.js');
const fs = require('fs');

async function refreshCommands(configFilePath) {
    const configFile = fs.readFileSync(configFilePath, 'utf8');
    const config = yaml.load(configFile);

    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(config.system.discordBotToken);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(config.system.discordClientId, config.system.discordGuildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { refreshCommands };
