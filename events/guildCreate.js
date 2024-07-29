const { Events } = require('discord.js');
const newGuildDb = require("./db/newGuildDb")

module.exports = {
	name: Events.GuildCreate,
	sub: [
		"newGuildDb"
	],
	async execute(guild) {
		await newGuildDb(guild)
	},
};