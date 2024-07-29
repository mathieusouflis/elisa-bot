const { SlashCommandBuilder } = require('discord.js');
const pause = require("./functions/pause.js")
const play = require("./functions/play.js")
const previous = require("./functions/previous.js")
const shuffle = require("./functions/shuffle.js")
const skip = require("./functions/skip.js")
const stop = require("./functions/stop.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription("Jouer de la musique !")
        .addSubcommand((subcommand)=>
        	subcommand
        		.setName('pause')
        		.setDescription("Faire une pause!")

        	)
        .addSubcommand((subcommand)=>
        	subcommand
        		.setName('play')
		        .setDescription("Lance une musique!")
		        .addStringOption(option =>
		            option
		                .setName('musique')
		                .setDescription("La musique que vous souhaitez jouer")
		                .setRequired(true))
		        	)
        .addSubcommand((subcommand)=>
        	subcommand
        		.setName('previous')
        		.setDescription("Aller en arière !")
        	)
        .addSubcommand((subcommand)=>
        	subcommand
        		.setName('shuffle')
        		.setDescription("Mélanger la queue!")
        	)
        .addSubcommand((subcommand)=>
        	subcommand
        		.setName('skip')
        		.setDescription("Passe a la musique suivante!")
        	)
        .addSubcommand((subcommand)=>
        	subcommand
        		.setName('stop')
        		.setDescription("Stoper la musique !")
        	),

    async execute(client, interaction) {
    	switch (interaction.options._subcommand){
    		case "pause":
                pause(client, interaction)
    			break;
    		case "play":
    			play(client, interaction)
                break;
    		case "previous":
                previous(client, interaction)
    			break;
    		case "shuffle":
                shuffle(client, interaction)
    			break;
    		case "skip":
                skip(client, interaction)
    			break;
    		case "stop":
                stop(client, interaction)
    			break;
    		default:
    			break;
    	}

    },
};
