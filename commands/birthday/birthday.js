const { SlashCommandBuilder } = require('discord.js');
const set = require("./functions/set.js")
const view = require("./functions/view.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription("Gère les anniversaires !")
        .addSubcommand((subcommand)=>
            subcommand
                .setName('set')
                .setDescription("Ajoute ton anniversaire !")
                .addIntegerOption((option) => 
                    option
                        .setName("day")
                        .setDescription("Le jour de votre naissance")
                        .setRequired(true))
                .addIntegerOption((option) => 
                    option
                        .setName("month")
                        .setDescription("Le mois de votre naissance")
                        .setRequired(true))
                .addIntegerOption((option) => 
                    option
                        .setName("year")
                        .setDescription("L'année de votre naissance")
                        .setRequired(false))

        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName('view')
                .setDescription("Montre votre anniversaire ou celui de quelqu'un d'autre")
                .addUserOption((option)=>
                    option
                        .setName("user")
                        .setDescription("La personne d'ont vous souhaitez savoir l'anniversaire")
                        .setRequired(false)
                )
        )
        .setDMPermission(false),

    async execute(client, interaction) {
        switch (interaction.options._subcommand){
            case "set":
                set(client, interaction)
                break;
            case "view":
                view(client, interaction)
                break;
            default:
                break;
        }

    },
};
