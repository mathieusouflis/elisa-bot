const { Events } = require('discord.js');
const autoVoiceManager = require("./autoVoice/autoVoiceManager")

module.exports = {
    name: Events.VoiceStateUpdate,
    sub: [
        "autoVoiceManager"
    ],

    async execute(oldState, newState) {

        await autoVoiceManager(oldState, newState)

    },
};
