const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription("Envois une photo de chien !"),
    async execute(client, interaction) {
        const response = await fetch("https://api.thedogapi.com/v1/images/search?api_key=live_ULfbzQtryWxpcuLnssewv2eI4gph1jYUrGRC1tqlBKJuGikOFkfacT9bEVSsQc06")
        const data = await response.json()
        await interaction.reply({content: data[0].url});
    },
};
