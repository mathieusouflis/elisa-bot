const { Events } = require('discord.js');
const newMemberMessage = require("./welcome/newMemberMessage")
const earlyTesters = require("./KDU/earlyTesters")

module.exports = {
	name: Events.GuildMemberAdd,
	sub: [
		"newMemberMessage",
		"earlyTesters"
	],
	async execute(member) {
		await newMemberMessage(member)
		await earlyTesters(member)
	},
};