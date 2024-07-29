const express = require("express")

module.exports = async (client) => {
	const app = express()
	const port = 3000

	app.get("/", (req, res) => {
		res.send("Hello World!")
	})

	app.get("/guilds", async (req, res) => {
		const guilds = await client.guilds.cache
		res.json(guilds)
	})

	app.get("/guilds/:id", async (req, res) => {
		const {id} = req.params
		const guild = await client.guilds.fetch(id)
		res.json(guild)
	})

	app.delete("/guilds/:id", async (req, res) => {
		const {id} = req.params
		const guild = await client.guilds.fetch(id)
		await guild.leave()
		res.status(200).end()
	})

	app.get("/guildmember", async(req, res) => {
		const {memberId, guildId } = req.query
		if(!memberId || !guildId) return res.status(400).end()
		
		const guild = client.guilds.cache.get(guildId)
		if(!guild) return res.status(400).end()

		const member = guild.members.cache.get(memberId)
		if(!member) return res.status(400).end()
		
		res.json(member).status(200).end()
	})

	app.delete("/guildmember", async(req, res) => {
		/**
		 * type = [ban, kick]
		*/
		const {memberId, guildId, type} = req.query
		
		const guild = client.guilds.cache.get(guildId)
		if(!guild) return res.status(400).end()

		const member = guild.members.cache.get(memberId)
		if(!member) return res.status(400).end()

		try {
			if(type == "ban"){
				await member.ban()
				return res.status(200).send("Member Banned").end()	
			}else if (type == "kick"){
				await member.kick()
				return res.status(200).send("Member Kicked").end()		
			}
			
		}catch (err) {
			console.log(err)
		}

	})

	app.listen(port, () => {
		console.log(`App online at ${port}`)
	})
}