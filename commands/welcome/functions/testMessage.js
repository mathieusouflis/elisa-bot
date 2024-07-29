const welcomeMessage = require("../../../utils/functions/welcomeMessage");

module.exports = async (client, interaction) => {
	const member = interaction.user
	const guild = interaction.guild
	
	await welcomeMessage(member, guild)
	
	await interaction.reply({content: "Message envoyé !", ephemeral: true})
}
