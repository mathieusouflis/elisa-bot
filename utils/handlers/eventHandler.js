const { readdirSync } = require('node:fs');

module.exports = async (client) => {
	const eventFolders = readdirSync("./events").filter((file) => file.endsWith(".js"))

	eventFolders.forEach(async file => {
			const event = await require(`../../events/${file}`);

			if(event.one){
				client.once(event.name, (...args) => event.execute(...args))
			}else{
				client.on(event.name, (...args) => event.execute(...args))
			}
			event.sub.forEach(subEvent => {
				console.log(`[E] ${event.name.toUpperCase()} - ${subEvent.toUpperCase()} a été chargée avec succes`)	
			})
			
	})
	
}