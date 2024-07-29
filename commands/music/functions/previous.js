const { useHistory } = require("discord-player")
module.exports = async (client, interaction) => {
    const history = useHistory(interaction.guild.id);
    await history.previous();
    await interaction.reply("La musique précédente vient d'être lancée !")
}
