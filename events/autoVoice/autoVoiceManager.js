const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, NewsChannel } = require("discord.js");
const { getDb, writeDb } = require("../../utils/functions/db");

module.exports = async (oldState, newState) => {
    
    const guild = oldState.guild;
    const newChannel = newState.channel;
    const newMember = newState.member;
    const newMemberId = newMember.id;
    const oldChannel = oldState.channel;

    let database = await getDb();
    const guildData = database.guilds[guild.id.toString()];
    let autoVoice = guildData.autoVoice;
    let masters = autoVoice.masters;

    if (newChannel && masters[newChannel.id]) {
        const newChannelCategory = newChannel.parent;
        const newChannelId = newChannel.id;
        const channelMaster = masters[newChannelId];
        const voiceChannels = channelMaster.voiceChannels;
        const categoryParent = newChannelCategory ? newChannelCategory.children : guild.channels.cache;
        const lastChannel = voiceChannels[Object.keys(voiceChannels)[Object.keys(voiceChannels).length - 1]];
        const num = lastChannel ? lastChannel.num + 1 : 0;

        const channel = await categoryParent.create({
            name: `${channelMaster.voicesName} #${num}`,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: newMemberId,
                    allow: [PermissionsBitField.Flags.PrioritySpeaker],
                },
            ]
        });

        voiceChannels[channel.id] = {
            owner: newMemberId,
            num: num
        };

        await writeDb(database);
        await newMember.voice.setChannel(channel.id);

        const embed = new EmbedBuilder()
            .setTitle("Panneau du vocal")
            .setDescription("📝 Renommer\n👥 Limite\n🔒 Lock / Unlock\n⛔ Bannir\n✅ Débannir\n👑 Transférer la propriété");

        const menu = [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("rename")
                    .setLabel("📝")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("limit")
                    .setLabel("👥")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("lock")
                    .setLabel("🔒")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("ban")
                    .setLabel("⛔")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("unban")
                    .setLabel("✅")
                    .setStyle(ButtonStyle.Success),
            ),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("transferOwn")
                    .setLabel("👑")
                    .setStyle(ButtonStyle.Primary)
            )
        ]

        const message = await channel.send({ content: `<@${newMemberId}>`, embeds: [embed], components: [menu[0], menu[1]] });

        const checkId = async (interactionId) => {
            const database = await getDb();
            const guildDb = database.guilds[guild.id];
            const masters = guildDb.autoVoice.masters;
            return Object.values(masters).some(master => master.voiceChannels[channel.id]?.owner === interactionId);
        };

        const filter = async (i) => await checkId(i.member.id);
        const component = await message.createMessageComponentCollector({ filter, time: 60000 });

        component.on('collect', async (i) => {
            try {
                switch (i.customId) {
                    case "limit":
                        await handleLimitModal(i, channel);
                        break;
                    case "ban":
                        await handlePermModal(i, guild, false);
                        break;
                    case "unban":
                        await handlePermModal(i, guild, true)
                    case "lock":
                        await handleLockToggle(i, channel);
                        break;
                    case "rename":
                        await handleRenameModal(i, channel);
                        break;
                    case "transferOwn":
                        await handleTransferOwnershipModal(i, channel, masters, guild);
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        });

        component.on('end', (collected, reason) => {
            if (reason === 'time') {
                console.log('Collector ended due to time limit.');
            } else {
                console.log('Collector ended due to reason: ', reason);
            }
        });
    }

    if (oldChannel && !oldChannel.members.size) {
        for (const [masterId, master] of Object.entries(masters)) {
            if (master.voiceChannels[oldChannel.id]) {
                delete master.voiceChannels[oldChannel.id];
                await oldChannel.delete();
                await writeDb(database);
            }
        }
    } else if (oldChannel) {
        if (oldState.selfDeaf !== newState.selfDeaf || oldState.selfMute !== newState.selfMute || oldState.selfVideo !== newState.selfVideo || oldState.serverDeaf !== newState.serverDeaf || oldState.serverMute !== newState.serverMute || oldState.streaming !== newState.streaming || oldState.suppress !== newState.suppress) return
        for (const [masterId, master] of Object.entries(masters)) {
            if (master.voiceChannels[oldChannel.id] && master.voiceChannels[oldChannel.id].owner === newMemberId) {
                const newOwnerMenu = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("newOwnerByLeft")
                            .setLabel("S'approprier le salon")
                            .setStyle(ButtonStyle.Primary)
                    );
                const newOwnerMessage = await oldChannel.send({ content: "**L'owner de ce salon est parti. Pour s'approprier le salon, appuyez sur le bouton ci-dessous**", components: [newOwnerMenu] });

                const filter = i => oldChannel.members.has(i.member.id) && !oldChannel.members.has(newMemberId);
                const newOwnerMessageCollector = await newOwnerMessage.createMessageComponentCollector({ filter, time: 60000 });

                newOwnerMessageCollector.on("collect", async (i) => {
                    let database = await getDb();
                    const guildDb = database.guilds[guild.id];
                    const masters = guildDb.autoVoice.masters;
                    const channelData = masters[masterId].voiceChannels[oldChannel.id]
                    const oldOwner = channelData.owner
                    const newOwner = i.member.id 
                    channelData.owner = newOwner;
                    await writeDb(database);
                    await updateOwnerPermissions(channel, oldOwner, newOwner)
                    await i.channel.send(`<@${newOwner}> est maintenant le nouveau propriétaire du salon.`);
                    await i.deferUpdate();
                });

                newOwnerMessageCollector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await newOwnerMessage.edit({content: "Pour devenir l'owner du salon, faites `/voice claim`", components: [] }).catch()
                    } else {
                        console.log('New owner collector ended due to reason: ', reason);
                    }
                });
            }
        }
    }
};

// Functions to handle specific modals
async function handleLimitModal(i, channel) {
    const limitModal = new ModalBuilder()
        .setCustomId("limitModal")
        .setTitle("Définir une nouvelle limite (entre 0 et 99)")
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("limitCount")
                        .setLabel("La nouvelle limite (0 - 99)")
                        .setStyle(TextInputStyle.Short)
                )
        );
    await i.showModal(limitModal);
    const limitModalFilter = modalI => i.user.id === modalI.user.id;
    const limitSubmitted = await i.awaitModalSubmit({ filter: limitModalFilter, time: 60000 }).catch();
    if (limitSubmitted) {
        let limit = parseInt(limitSubmitted.fields.getTextInputValue("limitCount"));
        if (isNaN(limit)) {
            await i.channel.send("Vous n'avez pas choisi un nombre valide");
        } else if (limit > 99 || limit < 0) {
            await i.channel.send("Le nombre que vous avez envoyé n'est pas entre `0 et 99`");
        } else {
            await channel.setUserLimit(limit);
            await i.channel.send(`La limite du salon a été fixée à \`${limit}\``);
        }
        await limitSubmitted.deferUpdate();
    }
}

async function handlePermModal(i, guild, status=false) {
    const banModal = new ModalBuilder()
        .setCustomId("banModal")
        .setTitle("Bannir un membre")
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("banId")
                        .setLabel("L'id de l'utilisateur")
                        .setStyle(TextInputStyle.Short)
                )
        );
    await i.showModal(banModal);
    const banModalFilter = modalI => i.user.id === modalI.user.id;
    const banSubmitted = await i.awaitModalSubmit({ filter: banModalFilter, time: 60000 }).catch();
    if (banSubmitted) {
        const banId = banSubmitted.fields.getTextInputValue("banId");
        const memberToBan = await guild.members.fetch(banId).catch(() => null);
        if (!memberToBan) {
            await i.channel.send(`Le membre que vous avez essayé de ${status ? "débannir" : "bannir"} n'existe pas.`);
        } else if (memberToBan.id === i.member.id) {
            await i.channel.send(`Vous ne pouvez pas vous ${status ? "débannir" : "bannir"} vous-même`);
        } else {
            await i.channel.permissionOverwrites.edit(memberToBan.id, { Connect: status ? null : false });
            if (memberToBan.voice.channel && memberToBan.voice.channel.id === i.channel.id) await memberToBan.voice.disconnect();
            await i.channel.send(`<@${memberToBan.id}> a été ${status ? "débanni" : "banni"} !`);
        }
        await banSubmitted.deferUpdate();
    }
}

async function handleLockToggle(i, channel) {
    const guildPerms = await channel.permissionOverwrites.cache.get(i.guild.id);
    const canEveryoneConnect = guildPerms ? !guildPerms.deny.has(PermissionsBitField.Flags.Connect) : true;
    await channel.permissionOverwrites.edit(i.guild.id, { Connect: !canEveryoneConnect });
    await i.channel.send(`Le salon a été ${canEveryoneConnect ? "vérouillé" : "dévérouillé"}`);
    await i.deferUpdate();
}

async function handleRenameModal(i, channel) {
    const renameModal = new ModalBuilder()
        .setCustomId("renameModal")
        .setTitle("Renommer le salon")
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("newName")
                        .setLabel("Le nouveau nom du salon")
                        .setStyle(TextInputStyle.Short)
                )
        );
    await i.showModal(renameModal);
    const renameModalFilter = modalI => i.user.id === modalI.user.id;
    const renameSubmitted = await i.awaitModalSubmit({ filter: renameModalFilter, time: 60000 }).catch();
    if (renameSubmitted) {
        const newName = renameSubmitted.fields.getTextInputValue("newName");
        await channel.edit({ name: newName });
        await i.channel.send(`Le salon a bien été renommé en \`${newName}\``);
        await renameSubmitted.deferUpdate();
    }
}

async function handleTransferOwnershipModal(i, channel, masters, guild) {
    const transferOwnModal = new ModalBuilder()
        .setCustomId("transferOwnModal")
        .setTitle("Transférer la propriété")
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("newOwner")
                        .setLabel("L'id du nouveau propriétaire")
                        .setStyle(TextInputStyle.Short)
                )
        );
    await i.showModal(transferOwnModal);
    const transferOwnFilter = modalI => i.user.id === modalI.user.id;
    const transferOwnSubmitted = await i.awaitModalSubmit({ filter: transferOwnFilter, time: 60000 }).catch();
    if (transferOwnSubmitted) {
        const newOwner = transferOwnSubmitted.fields.getTextInputValue("newOwner");
        if (!channel.members.has(newOwner)) {
            await i.channel.send("La personne spécifiée n'est pas dans le salon, veuillez réessayer.");
        } else if (newOwner === i.member.id) {
            await i.channel.send("Vous ne pouvez pas vous sélectionner vous-même");
        } else {
            let oldOwner;
            for (const [masterId, master] of Object.entries(masters)) {
                if (master.voiceChannels[channel.id]) {
                    let database = await getDb();
                    const guildDb = database.guilds[guild.id];
                    const masters = guildDb.autoVoice.masters;
                    const channelData = masters[masterId].voiceChannels[channel.id]
                    oldOwner = channelData.owner
                    channelData.owner = newOwner;
                    await writeDb(database);
                }
            }
            await updateOwnerPermissions(channel, oldOwner, newOwner)
            await i.channel.send(`<@${newOwner}> est maintenant le nouveau propriétaire du salon.`);
        }
        await transferOwnSubmitted.deferUpdate();
    }
}

async function updateOwnerPermissions(channel, oldOwnerId, newOwnerId) {
    if (oldOwnerId) {
        await channel.permissionOverwrites.edit(oldOwnerId, { PrioritySpeaker: null });
    }
    if (newOwnerId) {
        await channel.permissionOverwrites.edit(newOwnerId, { PrioritySpeaker: true });
    }
}