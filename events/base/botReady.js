const { ActivityType } = require('discord.js');
const { REST, Routes } = require('discord.js');
const updateDb = require('../../utils/functions/updateDb');
require("dotenv").config()
module.exports = async (client) => {
	client.user.presence.set({
		activities: [{name: 'Math coding...', type: ActivityType.Watching, url: "https://twitch.tv/naywa__"}],
	});

	console.log(`Ready! Logged in as ${client.user.tag}`);

	const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

	try {
		await rest.put(Routes.applicationCommands(client.user.id), {
			body: client.slashDatas,
		});
		console.log(`[U] Les commandes ont été UPLOAD pour les DM et les GUILDES`)	
		
	} catch (error) {
		console.error(error);
	}

	await updateDb(client)
	console.log("[V] La conformité de la db a été vérifiée...")

}
