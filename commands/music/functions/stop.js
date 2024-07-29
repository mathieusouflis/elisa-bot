const { useQueue } = require("discord-player")
module.exports = async (client, interaction) => {
    const queue = useQueue(interaction.guild.id);
    queue.delete();
    await interaction.reply("Queue supprimée, merci de l'écoute !")
}