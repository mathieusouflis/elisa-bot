const { Events } = require('discord.js');
const newSlashCommand = require("./base/newSlashCommand")

module.exports = {
    name: Events.InteractionCreate,
    sub: [
        "newSlashCommand"
    ],

    async execute(interaction) {

        await newSlashCommand(interaction)

    },
};
