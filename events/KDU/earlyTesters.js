module.exports = async (member) => {
    const application = member.client.application
    if(member.guild.id === "1258406398400659559" && await application.entitlements.fetch({skus: ["1260997271336783902"], user: member.id})) await member.roles.add("1261043299960230099")
}