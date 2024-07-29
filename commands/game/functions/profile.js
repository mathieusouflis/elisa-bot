const {getDb} = require("../../../utils/functions/db")

module.exports = async (client, interaction) => {
    let database = await getDb()
    let players = database["global"]["game"]["players"]
    interactionAuthor = interaction.user.id
    const userOption = interaction.options._hoistedOptions[0] || null
    const userId = userOption === null ? interactionAuthor : userOption.user.id

    if(!players[userId]) return await interaction.reply({content: userId === interactionAuthor ? "Vous n'avez pas encore de compte, pour en créer un veuillez utiliser la commande : /game register" : `<@${userId}> n'est pas inscrit dans le jeu...`, ephemeral: true})

    const player = players[userId]
    await interaction.reply({content: `Voici le profile de <@${userId}> :\n\nMoney : ${player["money"]}\nHealth : ${player["health"]}\nShield : ${player["shield"]}\nPower : ${player["power"]}\nStrength : ${player["strength"]}\nGuild : ${player["guild"]}\n`})
}
