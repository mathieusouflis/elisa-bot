require('dotenv').config();
const cron = require('node-cron');
const { Client } = require('discord.js');
const eventHandler = require("./utils/handlers/eventHandler.js")
const commandsHandler = require("./utils/handlers/commandHandler.js")
const birthday = require("./utils/events/birthday.js")

const expressClient = require("./server/main.js")

const client = new Client({ intents: 3276543 });

eventHandler(client)
commandsHandler(client)
// expressClient(client)

// SETUP BIRTHDAY
cron.schedule('0 0 * * *', async () => {
	await birthday(client)
})


client.login(process.env.BOT_TOKEN);