const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const sleep = require('../../utils/functions/sleep');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shifumi')
        .setDescription("Start a shifumi !")
        .addUserOption((option) =>
            option
                .setName("player2")
                .setDescription("La personne que vous souhaitez défier")
                .setRequired(false)
        ),

    async execute(client, interaction) {
        const turn_filter = (i, player_id) => {
            return i.user.id === player_id;
        }

        const player_turn = async (round_message, roundNumber, player_id) => {
            await round_message.edit({
                content: `**Round N°${roundNumber}** - C'est au tour de : <@${player_id}>, pierre, papier, ciseaux ?`,
                components: [choice_menu]
            });

            const component_collector = round_message.createMessageComponentCollector({
                filter: (i) => turn_filter(i, player_id),
                time: 60000
            });

            await interaction.channel.send(`<@${player_id}>`).then(async message => {
                await message.delete();
            });

            return new Promise((resolve, reject) => {
                component_collector.on("collect", async (i) => {
                    await i.deferUpdate();
                    component_collector.stop();
                    resolve(i.customId);
                });

                component_collector.on("end", async (collected, reason) => {
                    if (reason === "time") {
                        await round_message.edit({
                            content: `<@${player_id}> a pris trop de temps pour répondre, égalité...`,
                            components: []
                        });
                        resolve(null);
                    }
                });
            });
        }

        const bot_turn = () => {
            return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
        }

        const round = async (roundNumber = 1) => {
            const t = new Date();
            t.setSeconds(t.getSeconds() + 5);
            const round_message = await interaction.channel.send({
                content: `**Round N°${roundNumber}**, Le tour commencera dans <t:${Math.floor(Date.now() / 1000)}:R> !!`
            });
            await sleep(5);
            const response1 = await player_turn(round_message, roundNumber, player1);
            const response2 = is_player2_bot ? bot_turn() : await player_turn(round_message, roundNumber, player2);

            if (response1 === response2) {
                await round_message.edit({
                    content: `**Round N°${roundNumber}** : Egalité...`,
                    components: []
                });
                round(roundNumber + 1);
            } else {
                const winner = (response1 === "rock" && response2 === "scissors") ||
                    (response1 === "paper" && response2 === "rock") ||
                    (response1 === "scissors" && response2 === "paper") ? player1 : player2;
                await round_message.edit({
                    content: `<@${player1}> : ${response1}\n<@${player2}> : ${response2}\n\n<@${winner}> GAGNE LE SHIFUMI ! GG A LUI !!! 🏆🎉`,
                    components: []
                });
            }
        }

        const choice_menu = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("rock")
                    .setLabel("Rock")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🧱"),
                new ButtonBuilder()
                    .setCustomId("paper")
                    .setLabel("Paper")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🧻"),
                new ButtonBuilder()
                    .setCustomId("scissors")
                    .setLabel("Scissors")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("✂")
            );

        const enter_menu = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("yes")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                new ButtonBuilder()
                    .setCustomId("no")
                    .setLabel("No")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("✖")
            );

        let player1 = interaction.user.id;
        let player2 = interaction.options.getUser("player2") ? interaction.options.getUser("player2").id : client.user.id;
        const is_player2_bot = player2 === client.user.id;

        const is_user_actionner = (i, user_id) => {
            return i.user.id === user_id;
        }

        if (!is_player2_bot) {
            const enter_message = await interaction.reply({
                content: `<@${player2}>, <@${interaction.user.id}> te défis au SHIFUMI, souhaite tu accepter ce combat ?`,
                components: [enter_menu]
            });

            const filter = (i) => {
                return is_user_actionner(i, player2);
            }
            const component = enter_message.createMessageComponentCollector({ filter, time: 60000 });

            component.on("collect", async (i) => {
                const choice = i.customId;
                await i.deferUpdate();
                await enter_message.edit({
                    content: choice === 'yes' ? `<@${player2}> accepte le défi...` : `<@${player2}> a refusé le défi, il ne se sent pas capable de le relever...`,
                    components: []
                });
                component.stop();
                if (choice === "yes") round();
            });

            component.on("end", async (collected, reason) => {
                if (reason === "time") await enter_message.edit({
                    content: `<@${player2}> n'as pas répondu a temps...`,
                    components: []
                });
            });
        } else {
            await interaction.reply(`<@${player2}> accepte le défis...`);
            round();
        }
    },
};
