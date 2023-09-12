const RESTClient = require('../RESTClient');
const { SlashCommandBuilder } = require('discord.js');

const dvmClient = new RESTClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Sends a given Radio ID a check on DVMHost.')
        .addStringOption(option =>
            option.setName('rid')
                .setDescription('The Radio ID to check.')
                .setRequired(true)),
    async execute(interaction) {
        const dstId = interaction.options.getString('rid');
        const dstInt = parseInt(dstId);
        let dvmResponse = await dvmClient.send("192.168.1.128", 9990, "CalebisGay", "PUT", "/p25/rid", { command: "check", dstId: dstInt }, false);
        return interaction.reply({ content: `Checking ${dstId}.... for now Check the last heard channel`, ephemeral: false });
    }

};