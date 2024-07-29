const { Events } = require('discord.js');
const botReady = require("./base/botReady")

module.exports = {
	name: Events.ClientReady,
	once: true,
	sub: [
		"botReady"
	],
	async execute(client) {
		await botReady(client)

	},
};