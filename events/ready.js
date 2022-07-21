const { EmbedBuilder } = require("discord.js");
const client = require("../index");
const config = require("../config");
const cfx = require("cfx-api");

client.on("ready", () => {
    console.log(`${client.user.tag} is up and ready to go!`)

    if(!config.actuStatusBot || !config.actuStatusMSG || !config.serverID || !config.serverIP || !config.statusChannel) return
    
    ////DEBUT STATUS BOT////
    setInterval(async () => {
        const server = await cfx.fetchServer(config.serverID)
        const attVerif = true

        let etat = "❌ Serveur Offline"
        if(attVerif == true) { etat = `${server.playersCount} / ${server.maxPlayers}`}

        await client.user.setActivity(`${etat}`, {type: "WATCHING"})
    }, (config.actuStatusBot * 1000))
    ////FIN STATUS BOT////

    ////DEBUT MESSAGE STATUS////
    const msgChannel = client.channels.cache.get(config.statusChannel)

    try { msgChannel.bulkDelete(100) } catch (e) {} //Delete les messages du salon si il y en a.
    msgChannel.send({ embeds: [new EmbedBuilder().setColor("#ff7f00 ").setDescription("⏳ | En cours de chargement ...")]}).then((m) => {
        setInterval(async () => {
            const server = await cfx.fetchServer(config.serverID)

            let etat = true 

            if(etat == true) {
                let pOnline = ""
                const listPlayer = server.players
                if(Object.keys(listPlayer).length === 0 == true) {pOnline = "Aucun Joueur Connecté"} else {for(let p of listPlayer) {pOnline += `➔ \`${p.name}\`\n`}}

                const e1 = new EmbedBuilder()
                .setTitle(`${server.projectName}`)
                .setColor("#228B22")
                .setDescription(
                    `**IP Serveur** : \`💻 ${config.serverIP}\`\n` +
                    `**Status Serveur** : \`✅ Online\`\n` +
                    `**Nombre Joueur Connecté** : \`${server.playersCount}\` / \`${server.maxPlayers}\`` +
                    `\n\n` +
                    `**Liste des Joueurs** :\n ${pOnline}`
                )
                .setTimestamp()

                await m.edit({ embeds: [e1] })
            }

            if(etat == false) {
                const e1 = new EmbedBuilder()
                .setTitle(`${server.projectName}`)
                .setColor("#FF0000")
                .setDescription("Le serveur est actuellement \`❌ Offline\` !")
                .setTimestamp()

                await m.edit({ embeds: [e1] })
            }
        }, (config.actuStatusMSG * 1000))
    })
    ////FIN MESSAGE STATUT////
});
