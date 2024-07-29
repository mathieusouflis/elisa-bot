const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription("Envois un message à l'aide du bot.")
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription("Le message que vous souhaitez envoyer.")
                .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(13),
    async execute(client, interaction) {
        await interaction.channel.send(interaction.options._hoistedOptions[0].value)
        await interaction.reply({content: "Message envoyé !", ephemeral: true})
    },
};