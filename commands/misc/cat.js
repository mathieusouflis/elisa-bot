const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription("Envois une photo de chat !"),
    async execute(client, interaction) {
        const response = await fetch("https://api.thecatapi.com/v1/images/search?api_key=live_wYpkqHP2HttVQG2N3ICpjR5TWwtJZhqtlUTCxUUBkVwD7lM0WsoSltCl9Lba5mDg")
        const data = await response.json()
        await interaction.reply({content: data[0].url});
    },
};
