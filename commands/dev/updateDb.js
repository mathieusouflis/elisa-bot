const { SlashCommandBuilder } = require('discord.js');
const updateDb = require("../../utils/functions/updateDb")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatedb')
        .setDescription("Update la db !"),
    dev: true,
    async execute(client, interaction) {
        await updateDb(client)
        await interaction.reply("Done")
    },
};
