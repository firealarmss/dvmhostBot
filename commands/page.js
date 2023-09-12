const RESTClient = require('../RESTClient');
const { SlashCommandBuilder } = require('discord.js');
const yaml = require("js-yaml");
const fs = require('fs');

const dvmClient = new RESTClient();

const groupListFile = fs.readFileSync("groups.yml", 'utf8');
const groupList = yaml.load(groupListFile);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('page')
        .setDescription('Pages a given Radio ID/Group ID on DVMHost.')
        .addStringOption(option =>
            option.setName('rid')
                .setDescription('The Radio ID/Group ID to page.')
                .setRequired(true)),
    async execute(interaction) {
        const dstId = interaction.options.getString('rid');
        const dstInt = parseInt(dstId);

        let isDstIdInLists = false;
        let currentListName = '';
        let currentSubList = [];

        for (const group of groupList.grpPage) {
            for (const [key, value] of Object.entries(group)) {
                if (key.includes(dstId)) {
                    isDstIdInLists = true;
                    currentListName = key;
                    currentSubList = value;
                    break;
                }
            }

            if (isDstIdInLists) {
                break;
            }
        }

        if (isDstIdInLists) {
            for (const id of currentSubList) {
                await dvmClient.send("192.168.1.128", 9990, "CalebisGay", "PUT", "/p25/rid", { command: "page", dstId: parseInt(id) }, false);
            }
            return interaction.reply({ content: `Paging list ${currentListName}...`, ephemeral: false });
        } else {
            await dvmClient.send("192.168.1.128", 9990, "CalebisGay", "PUT", "/p25/rid", { command: "page", dstId: dstInt }, false);
            return interaction.reply({ content: `Paging ${dstId}...`, ephemeral: false });
        }
    }

};