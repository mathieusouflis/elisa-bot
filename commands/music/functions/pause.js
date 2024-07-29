const { useQueue } = require("discord-player")
module.exports = async (client, interaction) => {
	const queue = useQueue(interaction.guild.id);
	queue.node.setPaused(!queue.node.isPaused());//isPaused() returns true if that player is already paused
	await interaction.reply("La musique vient d'être mise en pause !")
}
