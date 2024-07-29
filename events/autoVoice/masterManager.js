const { getDb, writeDb } = require("../../utils/functions/db");

module.exports = async (channel) => {
    let database = await getDb();
    const guildData = database.guilds[channel.guild.id.toString()];
    let masters = guildData.autoVoice.masters;

    if (masters[channel.id]) {
        delete masters[channel.id];
        await writeDb(database);
        console.log(`Master channel ${channel.id} deleted from database.`);
    }
}