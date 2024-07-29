const { Events } = require('discord.js');
const roleStatus = require("./status/roleStatus")

module.exports = {

	// name: Events.PresenceUpdate,
	name: Events.ClientReady,
	once: true,
	sub: [
		"roleStatus"
	],
	async execute(oldPresence, newPresence) {
		// await roleStatus(oldPresence, newPresence)
	},
};