const { Events } = require('discord.js');
const test = require("./Entitlements/test")

module.exports = {
	name: Events.EntitlementCreate,
	sub: [
		"test"
	],
	async execute(entitlement) {
		console.log(entitlement)
        console.log(entitlement.client.bot)
        console.log(entitlement.client.application.entitlements)
        console.log(await entitlement.client.application.fetchSKUs())
        // await test(entitlement)

	},
};