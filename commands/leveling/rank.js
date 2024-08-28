const { SlashCommandBuilder } = require("discord.js");
const { getDb } = require("../../utils/functions/db");
const { xpForLevel } = require("../../utils/functions/leveling");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Leveling plugin")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("L'utilisateur que vous souhaitez inspecter.")
        .setRequired(false),
    ),
  async execute(client, interaction) {
    let database = await getDb();
    let users =
      database["guilds"][interaction.guild.id.toString()]["leveling"]["users"];

    interactionAuthor = interaction.user.id;
    const userOption = interaction.options._hoistedOptions[0] || null;
    const userId = userOption === null ? interactionAuthor : userOption.user.id;
    const userLevel = users[userId];
    if (userId === interactionAuthor)
      return await interaction.reply({
        content: !userLevel
          ? "Vous n'avez encore jamais envoyé de messages dans le serveur."
          : `Vous êtes actuellement au rang : ${userLevel["level"]} et avez ${userLevel["xp"]}/${xpForLevel(userLevel["level"] + 1)}xp.`,
      }); // CALCULER L'XP MANQUANT
    return await interaction.reply({
      content: !userLevel
        ? `<@${userId}> n'a encore jamais envoyé de messages dans le serveur.`
        : `<@${userId}> est actuellement au rang : ${userLevel["level"]} et a ${userLevel["xp"]}/${xpForLevel(userLevel["level"] + 1)}xp.`,
    }); // CALCULER L'XP MANQUANT
  },
};
