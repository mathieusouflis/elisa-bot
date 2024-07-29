const {getDb, writeDb} = require("../../../utils/functions/db")
const calculAge = require("../../../utils/functions/calculAge")

module.exports = async (client, interaction) => {
    const user = interaction.options._hoistedOptions[0]
    const userId = user ? user.value : interaction.member.id
    const database = await getDb()

    const birthdayData = database["guilds"][interaction.guild.id.toString()]["birthday"]["users"][userId.toString()]
    if(!birthdayData) return await interaction.reply({content: `${userId === interaction.member.id ? "Vous n'avez" : `<@${userId}> n'a`} pas renseigné sa date d'anniverssaire...`, ephemeral: true})
        const year = birthdayData["year"]
        const month = birthdayData["month"]
        const day = birthdayData["day"]
    await interaction.reply({content: `<@${userId}> est né le ${day}/${month}${year ? `/${year} et a maintenant ${await calculAge(year, month, day)} ans` : ""}`})
}