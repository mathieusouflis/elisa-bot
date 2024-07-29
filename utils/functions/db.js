const fs = require("node:fs")

module.exports = {
	async getDb(){
		let dataBase = fs.readFileSync('./database.json', { encoding: 'utf8'});
        return JSON.parse(dataBase)
	},
	async writeDb(data){
		try {
			// Convertir les BigInt en chaînes de caractères avant la sérialisation
			const serializedData = JSON.stringify(data, (key, value) =>
				typeof value === 'bigint' ? value.toString() : value,
				2 // indentation de 2 espaces pour une meilleure lisibilité
			);
			
			// Écrire les données dans le fichier de manière asynchrone
			fs.writeFileSync("./database.json", serializedData, { encoding: "utf8" });
			console.log("Les données ont été écrites avec succès dans la base de données.");
			return true;
		} catch (error) {
			console.error("Erreur lors de l'écriture des données dans la base de données :", error);
			return false;
		}
	}
}