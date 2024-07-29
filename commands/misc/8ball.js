const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription("Pose une question à l'oracle!")
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription("Ce que vous souhaitez demander à l'oracle")
                .setRequired(true)),
    async execute(client, interaction) {
        const responses = ["Oui", "Non", "Peut-être", "Jamais", "Bien sûr!", "Un jour", "Je ne pense pas", "Si math le veut bien"];
        await interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
    },
};
