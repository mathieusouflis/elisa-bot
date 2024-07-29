const { getDb, writeDb } = require("../../utils/functions/db")

module.exports = async (guild) => {
    let database = await getDb()
    delete database[guild.id.toString()]
    await writeDb(database)
}
