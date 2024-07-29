const { Events } = require('discord.js');
const messageXp = require("./leveling/messageXp.js")
module.exports = {
	name: Events.MessageCreate,
	sub: [
	"messageXp"
	],
	async execute(message) {
		await messageXp(message)
	},
};