const {getDb, writeDb} = require("../../../utils/functions/db")

module.exports = async (client, interaction) => {
	const channelId = interaction.options._hoistedOptions[0].value
	let database = await getDb()
	database["guilds"][interaction.guild.id.toString()]["welcome"]["channel"] = channelId
	await writeDb(database)

	await interaction.reply({content: `Les messages de bienvenue s'enverront bien dans le salon <#${channelId}>`, ephemeral: true})
}
