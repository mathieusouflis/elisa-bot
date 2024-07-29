const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const setMessage = require("./functions/setMessage")
const testMessage = require("./functions/testMessage");
const setChannel = require('./functions/setChannel');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription("Module for welcome things !")
        .addSubcommand((subcommand)=>
            subcommand
                .setName('set-message')
                .setDescription("Change le message de bienvenue !")
                .addStringOption((option)=>
                    option
                        .setName("message")
                        .setDescription("Le message envoyé lors de l'arrivé d'un membre (/tags for help).")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-channel")
                .setDescription("Change le salon de bienvenue")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Le salon de bienvenue")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("test")
                .setDescription("Test le message de bienvenue.")
        )
        .setDefaultMemberPermissions(PermissionsBitField.Administrator)
        .setDMPermission(false),

    async execute(client, interaction) {
        switch (interaction.options._subcommand){
            case "set-message":
                setMessage(client, interaction)
                break;
            case "set-channel":
                setChannel(client, interaction)
                break;
            case "test":
                testMessage(client, interaction)
            default:
                break;
        }

    },
};
