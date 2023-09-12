const RESTClient = require('../RESTClient');
const { SlashCommandBuilder } = require('discord.js');

const dvmClient = new RESTClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unbrick')
        .setDescription('Uninhibits a given Radio ID on the CTRS system.')
        .addStringOption(option =>
            option.setName('rid')
                .setDescription('The Radio ID to uninhibit.')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
        }

        const dstId = interaction.options.getString('rid');
        const dstInt = parseInt(dstId);
        let dvmResponse = await dvmClient.send("192.168.1.128", 9990, "CalebisGay", "PUT", "/p25/rid", { command: "uninhibit", dstId: dstInt }, true);

        return interaction.reply({ content: `Uninhibited ${dstId}` });
    }
};