const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mathieutoutnu')
        .setDescription("Vois Mathieu NU")
        .setNSFW(true),
    async execute(client, interaction) {
        await interaction.reply({content: "T'as vraiment cru que tu pouvais voir math nu [????????](https://mym.fans/Fzljm)", ephemeral: true});
    },
};
