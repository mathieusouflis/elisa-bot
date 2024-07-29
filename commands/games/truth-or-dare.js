const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truth-or-dare')
        .setDescription("Start a truth or dare !"),

    async execute(client, interaction) {

        const random = (number) => {
            return Math.floor(Math.random() * number)
        }

        const menu = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("truth")
                    .setLabel("Truth")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🤐"),
                new ButtonBuilder()
                    .setCustomId("dare")
                    .setLabel("Dare")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🤭")
            )
        const menu_difficulty = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("soft")
                    .setLabel("Soft")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("🍃"),
                new ButtonBuilder()
                    .setCustomId("medium")
                    .setLabel("Medium")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("👤"),
                new ButtonBuilder()
                    .setCustomId("hard")
                    .setLabel("Hard")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🔥")
            )

        const base_message = await interaction.reply({content: "Action ou vérité ?", components: [menu]})

        const filter = async (i) => {
            return i.user.id === interaction.user.id
        }
        let component = await base_message.createMessageComponentCollector({ filter, time: 60000 });

        component.on('collect', async (i) => {
            const choice = i.customId
            await base_message.edit({content: `${choice === "truth" ? "Vérité" : "Action"} : Choisissez la difficulté.`, components: [menu_difficulty]})
            component.stop()
            await i.deferUpdate()
            component = await base_message.createMessageComponentCollector({filter, time: 6000})
            
            component.on("collect", async(i2) => {
                const difficulty = i2.customId
                let message;

                if (choice === "truth"){

                    switch (difficulty){
                        case "soft":
                            const { verite_soft } = require("../../utils/assets/verite")
                            message = verite_soft[random(verite_soft.length)]
                            break
                        case "medium":
                            const { verite_medium } = require("../../utils/assets/verite")
                            message = verite_medium[random(verite_medium.length)]
                            break
                        case "hard":
                            const { verite_hard } = require("../../utils/assets/verite")
                            message = verite_hard[random(verite_hard.length)]
                            break
                    }

                }else {
                    switch (difficulty){
                        case "soft":
                            const { action_soft } = require("../../utils/assets/actionIrl")
                            message = action_soft[random(action_soft.length)]
                            break
                        case "medium":
                            const { action_medium } = require("../../utils/assets/actionIrl")
                            message = action_medium[random(action_medium.length)]
                            break
                        case "hard":
                            const { action_hard } = require("../../utils/assets/actionIrl")
                            message = action_hard[random(action_hard.length)]
                            break
                    }
                }
                component.stop()
                await i2.deferUpdate()
                await base_message.edit({content: message, components: []})
                
            })
        });
    },
};
