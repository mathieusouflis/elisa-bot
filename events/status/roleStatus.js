const updateStatus = require("../../utils/functions/statusUpdate.js")
module.exports = async (oldPresence, newPresence) => {
	const guild = newPresence.guild
	return await updateStatus(guild, newPresence.member)
}