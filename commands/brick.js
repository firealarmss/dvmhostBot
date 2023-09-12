const RESTClient = require('../RESTClient');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const dvmClient = new RESTClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('brick')
        .setDescription('Inhibits a given Radio ID on the CTRS system.')
        .addStringOption(option =>
            option.setName('rid')
                .setDescription('The Radio ID to inhibit.')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
        }

        const dstId = interaction.options.getString('rid');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_inhibit')
                    .setLabel('Confirm')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('cancel_inhibit')
                    .setLabel('Cancel')
                    .setStyle('Secondary'),
            );

        await interaction.reply({ content: `Are you sure you want to make a 4000$ brick: ${dstId}?`, components: [row] });

        const filter = i => i.customId === 'confirm_inhibit' || i.customId === 'cancel_inhibit';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });  // 15 seconds timeout

        collector.on('collect', async i => {
            if (i.customId === 'confirm_inhibit') {
                const dstInt = parseInt(dstId);
                let dvmResponse = await dvmClient.send("192.168.1.128", 9990, "CalebisGay", "PUT", "/p25/rid", { command: "inhibit", dstId: dstInt }, false);
                await i.update({ content: `Inhibited ${dstId}`, components: [] });
            } else {
                await i.update({ content: `Inhibition for ${dstId} cancelled.`, components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: `Confirmation time has expired. No 4000$ brick today for ${dstId}`, components: [] });
            }
        });
    }
};