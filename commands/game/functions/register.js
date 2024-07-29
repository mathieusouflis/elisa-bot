const {getDb, writeDb} = require("../../../utils/functions/db")

module.exports = async (client, interaction) => {
	let database = await getDb()
	let players = database["global"]["game"]["players"]
	const userId = interaction.user.id.toString()

	if(players[userId]) return await interaction.reply({content: "Vous avez déjà un compte...", ephemeral: true})

	players[userId] = {
		"money": 0,
		"health": 100,
		"shield": 0,
		"power": 10,
		"strength": 10,
		"guild": null,
		"inventory": {}
	}

	await writeDb(database)

	await interaction.reply({content: "Votre compte a bien été créé !", ephemeral: true})
}