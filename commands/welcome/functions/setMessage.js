const {getDb, writeDb} = require("../../../utils/functions/db")

module.exports = async (client, interaction) => {
	let message = interaction.options._hoistedOptions[0].value
	
	let database = await getDb()
	database["guilds"][interaction.guild.id.toString()]["welcome"]["channel"] = message
	await writeDb(database)


	await interaction.reply({content: `Le message de bienvenue a bien été mis a jour :\nNouveau message : \`${message}\``, ephemeral: true})
}
