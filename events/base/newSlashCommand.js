const { Collection, InteractionType } = require('discord.js');
const cooldown = new Collection();

module.exports = async (interaction) => {
    const { client } = interaction;
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.user.bot) {
            return;
        }

        const command = client.slashCommands.get(interaction.commandName);
        
        if (!command) {
            console.error(`[E] Commande non trouvée: ${interaction.commandName}`);
            return interaction.reply({ content: "Commande non trouvée...", ephemeral: true });
        }

        try {
            if (command.cooldown) {
                if (cooldown.has(`${command.data.name}-${interaction.user.id}`)) {
                    const nowDate = interaction.createdTimestamp;
                    const waitedDate = cooldown.get(`${command.data.name}-${interaction.user.id}`) - nowDate;
                    return interaction.reply({
                        content: `Vous devez attendre <t:${Math.floor(new Date(nowDate + waitedDate).getTime() / 1000)}:R> avant de refaire la commande...`,
                        ephemeral: true,
                    }).then(() => setTimeout(() => interaction.deleteReply(), cooldown.get(`${command.data.name}-${interaction.user.id}`) - Date.now() + 1000));
                }

                await command.execute(client, interaction);

                cooldown.set(`${command.data.name}-${interaction.user.id}`, Date.now() + command.cooldown);

                setTimeout(() => {
                    cooldown.delete(`${command.data.name}-${interaction.user.id}`);
                }, command.cooldown + 1000);
            } else {
                const application = await client.application.fetch()
                if(command.dev && interaction.user.id !== application.owner.ownerId) return await interaction.reply({content: "Seul l'owner du bot peut faire cette commande", ephemeral: true})
                const name = interaction.commandName
                const author = interaction.client.user.id
                const where = interaction.inGuild() ? interaction.guildId : "DM"
                console.log(`[LOG] ${name.toUpperCase()} used by ${author} in ${where}`)
                await command.execute(client, interaction);
            }
        } catch (e) {
            console.error(e);
            interaction.reply({ content: "Un problème est survenu lors de l'exécution de la commande ! Veuillez réessayer.", ephemeral: true });
        }
    }
}
