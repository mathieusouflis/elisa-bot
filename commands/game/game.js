const { SlashCommandBuilder } = require('discord.js');
const register = require("./functions/register.js")
const profile = require("./functions/profile.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription("Jouer de la musique !")
        .addSubcommand((subcommand)=>
            subcommand
                .setName('register')
                .setDescription("Se créer un compte !")

        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('profile')
                .setDescription("Affiche le profile d'un joueur")
                .addUserOption((option) => 
                    option
                        .setName("joueur")
                        .setDescription("Le profile du joueur que vous souhaitez consulter.")
                        .setRequired(false)
                )
        ),

    async execute(client, interaction) {
        switch (interaction.options._subcommand){
            case "register":
                register(client, interaction)
                break;
            case "profile":
                profile(client, interaction)
            default:
                break;
        }

    },
};
