const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Envois un nombre compris entre deux autres.')
        .addIntegerOption((option)=>
            option 
                .setName("nombre1")
                .setDescription("Un nombre")
                .setRequired(true)
        )
        .addIntegerOption((option)=>
            option
                .setName("nombre2")
                .setDescription("Un autre nombre")
                .setRequired(true)
        ),
	cooldown: 5000,
	async execute(client, interaction) {
        const options = interaction.options._hoistedOptions
        let number1 = options[0].value
        let number2 = options[1].value
        
        if(number2 > number1){
            let mid = number1
            number1 = number2
            number2 = mid
        }

        await interaction.reply(`Le nombre choisis est : ${Math.floor(Math.random() * number1) + number2}`)        
    },
};