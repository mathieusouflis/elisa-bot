const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const {tagList} = require("../../utils.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('tags')
        .setDescription("Affiche la liste des tags.")
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDMPermission(false),
    async execute(client, interaction) {
        let message = ""
        tagList.forEach(tag => {
            message += `\`{${tag[0]}}\` -> ${tag[1]}\n`
        })
        await interaction.reply({content: message, ephemeral: true});
    },
};
