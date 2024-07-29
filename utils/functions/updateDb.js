const {getDb, writeDb} = require('./db')

module.exports = async (client, guildId = null) => {
    const guilds = guildId ? [guildId]: await client.guilds.fetch()

    let dataBase = await getDb()
    let dataGuilds = dataBase["guilds"]

    //VERIF QUE TOUTES LES GUILDES SONT DANS LA DB
    guilds.forEach(guild => {
        const guildId = guild.id.toString()
        if (!dataGuilds[guildId]){
            dataGuilds[guildId] = {
                "settings": {
                    "language": "fr",  
                },
                "birthday": {
                    "channel": "",
                    "users": {

                    }
                },
                "welcome": {
                    "channel": "",
                    "message": ""
                },
                "presence": {
                    "link":"",
                    "role": ""
                },
                "logs": {
                    "channel": ""
                },
                "leveling": {
                    "users": {
                        
                    }
                }
            }
        }
    })
    
    //VERIF QUE LA DB DES GUILDES SONT COMPLETES
    //..........................................

    // guilds.forEach(guild => {
    //     const guildId = guild.id.toString()
    //     dataBase.guilds[guildId].autoVoice = {
    //         masters: {}
    //     }
    // })

    await writeDb(dataBase)
}