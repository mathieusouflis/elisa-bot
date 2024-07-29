const {getDb, writeDb} = require("../../../utils/functions/db")

module.exports = async (client, interaction) => {
    const day = interaction.options._hoistedOptions[0].value
    const month = interaction.options._hoistedOptions[1].value
    let year = interaction.options._hoistedOptions[2]

    if (new Date(`2024-${month}-${day}`) == "Invalid Date") return await interaction.reply({content: "La date donnée n'est pas valide", ephemeral: true})

    const database = await getDb()

    database["guilds"][interaction.guild.id.toString()]["birthday"]["users"][interaction.member.id] = {
        day,
        month,
        year: year ? year.value : undefined
    }

    await writeDb(database)
    return await interaction.reply({content: "Votre date de naissance a été ajoutée ! Vous serez notifiés lors de votre anniversaire !!! :tada:", ephemeral: true})
}
