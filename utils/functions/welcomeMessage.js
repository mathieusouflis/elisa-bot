const {tagList} = require("../../utils.js")
const { getDb } = require("./db")

module.exports = async (member, guild) => {
    const database = await getDb()
		const welcomeSettings = database["guilds"][guild.id.toString()]["welcome"]
		
		let message = welcomeSettings["message"]
		const channel = guild.channels.cache.get(welcomeSettings["channel"])
		
		if(!channel || !message) return
		
		for (var i = 0; i < tagList.length; i++) {
			const tag = tagList[i][0]
			switch(tag){
				case "member":
					message = message.replaceAll("{member}", `<@${member.id}>`)
					break
				case "memberId":
					message = message.replaceAll("{memberId}", member.id.toString())
					break
				case "server":
					message = message.replaceAll("{server}", guild.name)
					break
				case "serverId":
					message = message.replaceAll("{serverId}", guild.id.toString())
					break
				case "memberCount":
					message = message.replaceAll("{memberCount}", guild.memberCount)
					break
				default:
					break;
			}
		}

		await channel.send(message).catch((err) => {
			console.log("[ERROR] EVENT WELCOME NEWMEMBERMESSAGE")
		})
}

// module.exports = {
//     async execute(member, guild){
        
//     }
// }