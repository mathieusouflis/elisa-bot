const { useQueue } = require("discord-player")
module.exports = async (client, interaction) => {
	const queue = useQueue(interaction.guild.id);
	queue.tracks.shuffle();
	await interaction.reply("La queue vient d'être mélangée !")
}