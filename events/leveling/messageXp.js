const { getDb, writeDb } = require("../../utils/functions/db")
const { canLevelUp, xpForLevel, xpToLevelUp } = require("../../utils/functions/leveling")

module.exports = async (message) => {
    if (message.author.bot) return
    const authorId = message.author.id
    const guildId = message.guildId
    let database = await getDb()
    let levelingUsers = database["guilds"][guildId]["leveling"]["users"]
    let levelingAuthorData = levelingUsers[authorId.toString()]
    const nowTimeStamp = Date.now()
    if(!levelingAuthorData){
        levelingUsers[authorId.toString()] = {
            "level": 0,
            "xp": 0,
            "lastMessage": nowTimeStamp
        }
        levelingUsers[authorId.toString()]["xp"] = Math.floor(Math.random() * 5) + 5
    }else {
        if(nowTimeStamp - levelingAuthorData["lastMessage"] < 5000) return 
        levelingAuthorData["xp"] += Math.floor(Math.random() * 5) + 5
        
        const xp = levelingAuthorData["xp"]
        const level = levelingAuthorData["level"]
        
        if(canLevelUp(xp, level)){
            levelingAuthorData["xp"] = xp - xpForLevel(level)
            levelingAuthorData["level"] += 1
            await message.channel.send(`<@${message.author.id}> vient de passer au niveau ${levelingAuthorData["level"]} ! :tada:`)
        }
            levelingAuthorData["lastMessage"] = nowTimeStamp
    }

    await writeDb(database)

}