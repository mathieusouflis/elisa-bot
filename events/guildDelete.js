const { Events } = require('discord.js');
const deleteGuildDb = require("./db/deleteGuildDb")

module.exports = {
	name: Events.GuildDelete,
	sub: [
		"deleteGuildDb"
	],
	async execute(guild) {
		await deleteGuildDb(guild)
	},
};