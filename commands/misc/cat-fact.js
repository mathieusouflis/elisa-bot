const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription("Envois une annecdote de chat !"),
    async execute(client, interaction) {
        const response = await fetch("https://catfact.ninja/fact")
        const data = await response.json()
        await interaction.reply({content: data.fact});
    },
};
