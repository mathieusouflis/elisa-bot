const { getDb } = require("../functions/db")
const calculAge = require("../functions/calculAge")

module.exports = async (client) => {
	const database = await getDb()
	const guilds = database["guilds"]

	Object.keys(guilds).forEach(guildId => {
		if(guilds[guildId]["birthday"]["channel"] === "") return
		const guildBirthdays = guilds[guildId]["birthday"]["users"]
		Object.keys(guildBirthdays).forEach(async userId => {
			const today = Date.now()
			const birthday = guilds[guildId]["birthday"]["users"][userId]
			const year = birthday["year"]
			const month = birthday["month"]
			const day = birthday["day"]
			if(new Date(`${new Date(today).getFullYear()}-${month}-${day}`).getTime() === today){
				const channels = await client.guilds.fetch(guildId).channels.fetch()
				await channels[0].send(`C'est l'anniversaire de <@${userId}> :tada: ! ${year ? `Joyeux ${await calculAge(year, month, day)} ans !` : ""}`)
			}
		})
	})
}
