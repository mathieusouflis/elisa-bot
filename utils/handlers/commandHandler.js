const { Collection } = require('discord.js');
const { readdirSync } = require('node:fs');

module.exports = async (client) => {
	client.commands = new Collection();
	client.slashCommands = new Collection();
	client.slashDatas = [];

	const commandFolders = readdirSync('./commands');

	commandFolders.forEach(async category => {
		const commandFiles = readdirSync(`./commands/${category}`).filter(file => file.endsWith(".js"));
	
		commandFiles.forEach(async file => {
			const command = await require(`../../commands/${category}/${file}`)
	
			if (command && command.data && typeof command.execute == "function"){
				client.slashDatas.push(command.data.toJSON())
				client.slashCommands.set(command.data.name, command)
				console.log(`[C] ${category.toUpperCase()} - ${command.data.name.toUpperCase()} a été chargée avec succes`)
			}
		})
	})
}