const {getDb} = require("./db")

module.exports = async (guild, member) => {
	const guildId = guild.id

	const database = await getDb()
	const presenceSettings = guildSettings["presence"]
	const presenceRole = presenceSettings["role"]
	const presenceLink = presenceSettings["link"]
	const role = guild.roles.cache.get(presenceRole)
	// VERIFIONS QUE LE ROLE EXISTE / EST DEFINIS ET QUE LE LIENS AUSSI
	if(!role || presenceLink.length === 0) return
	
	let activityState = member.presence.activities.filter((activity) => activity.name == "Custom Status")
	
	if(!activityState[0]) return

	activityState = activityState[0].state

	try {
		if(!activityState.includes(presenceLink)) return await member.roles.remove(role)

		return await member.roles.add(role)
	}catch(err){
		const logChannel = guildSettings["logs"]["channel"]
		if(err.name == "DiscordAPIError[50013]"){
			await guild.channels.cache.get(logChannel).send(`[ERROR] Je n'ai pas pu ajouter le role de présence sur <@${member.id}> du a un manque de permissions.`).catch((err) => {})
		}else {
			await guild.channels.cache.get(logChannel).send(`[ERROR] Une erreur est survenue... Veuillez contacter le support\nErreur : ${err.name}\nMessage : ${err.message}`).catch((err) => {})
		}
	}
}