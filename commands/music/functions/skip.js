const { useQueue } = require("discord-player")
module.exports = async (client, interaction) => {
	const queue = useQueue(interaction.guild.id);
	queue.node.skip()
	await interaction.reply("La musique vient d'être skip !")
}
