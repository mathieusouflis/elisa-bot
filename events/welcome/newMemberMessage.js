const welcomeMessage = require("../../utils/functions/welcomeMessage");

module.exports = async (member) => {
	const guild = member.guild
	await welcomeMessage(member, guild)
}