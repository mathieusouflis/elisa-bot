const updateDb = require("../../utils/functions/updateDb")

module.exports = async (guild) => {
    updateDb(guild.client, guild)
}