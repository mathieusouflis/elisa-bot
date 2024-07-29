const { Events } = require('discord.js');
const masterManager = require("./autoVoice/masterManager")

module.exports = {
	name: Events.ChannelDelete,
	sub: [
		"masterManager"
	],
	async execute(channel) {
		await masterManager(channel)
	},
};