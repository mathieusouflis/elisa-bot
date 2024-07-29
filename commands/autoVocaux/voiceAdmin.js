const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { getDb, writeDb } = require('../../utils/functions/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-voice-master')
        .setDescription("Crée un salon 'master' pour le plugin auto vocaux")    
        .setDefaultMemberPermissions(13)
        .setDMPermission(false),
    async execute(client, interaction) {
        const guild = interaction.guild
        const guildId = interaction.guild.id

        let databse = await getDb()
        let guildData = databse.guilds[guildId.toString()]

        const masterChannel = await guild.channels.create({ type: ChannelType.GuildVoice, name: "➕ Voice Master" })
        guildData.autoVoice.masters[masterChannel.id.toString()] = {
            uses: 0,
            voicesName : "Salon",
            voiceChannels : {}
        }

        await writeDb(databse)
        await interaction.reply({content: "Master Channel created.", ephemeral : true})
    },
};