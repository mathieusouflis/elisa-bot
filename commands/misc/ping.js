const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	cooldown: 5000,
	async execute(client, interaction) {
		const delay = Math.abs(interaction.createdTimestamp - Date.now())
		await interaction.reply(`Pong 🏓 (\`${delay}ms\`)`);
	},
};