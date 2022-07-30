const { EmbedBuilder } = require("discord.js");
const client = require("../index");
const config = require("../config.json");
const cfx = require("cfx-api");
const fs = require("fs");

client.on("ready", () => {
    console.log(`${client.user.tag} is up and ready to go!`)

    if(!config.actuStatusBot || !config.actuStatusMSG || !config.serverID || !config.serverIP || !config.statusChannel) return
    
    ////DEBUT STATUS BOT////
    setInterval(async () => {
        const server = await cfx.fetchServer(config.serverID)
        const attVerif = true

        let etat = "❌ Serveur Offline"
        if(attVerif === true) { etat = `${server.playersCount} / ${server.maxPlayers}`}

        await client.user.setActivity(`${etat}`, {type: "WATCHING"})
    }, (config.actuStatusBot * 1000))
    ////FIN STATUS BOT////

    ////DEBUT MESSAGE STATUS////
    setInterval(async function () {
        const server = await cfx.fetchServer(config.serverID)
        const channel = client.channels.cache.get(config.statusChannel)
        let message_pop = config.popMessage[0]
        let etat = true
        let pOnline = ""
        const listPlayer = server.players

        if(message_pop === false) {
            if(etat === true) {
                if(listPlayer.length === 0) {pOnline = "Aucun Joueur Connecté"} else {listPlayer.map(e => {pOnline += `➔ \`${e.name}\`\n`})}

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

               let msg = await channel.send({embeds: [e1]})

               config.popMessage[0] = true
               config.popMessage[1] = msg.id
            }

            if(etat === false) {
                const e1 = new EmbedBuilder()
                    .setTitle(`${server.projectName}`)
                    .setColor("#FF0000")
                    .setDescription("Le serveur est actuellement \`❌ Offline\` !")
                    .setTimestamp()

                let msg = await channel.send({embeds: [e1]})

                config.popMessage[0] = true
                config.popMessage[1] = msg.id
            }

            fs.writeFile("./config.json", JSON.stringify(client.db, null, 2), (err) => {if (err) return console.log(err)})


        }else {
            let message = await channel.messages.fetch(config.popMessage[1])

            if(etat === true) {
                if(listPlayer.length === 0) {pOnline = "Aucun Joueur Connecté"} else {listPlayer.map(e => {pOnline += `➔ \`${e.name}\`\n`})}

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

                message.edit({embeds: [e1]})
            }

            if(etat === false) {
                const e1 = new EmbedBuilder()
                    .setTitle(`${server.projectName}`)
                    .setColor("#FF0000")
                    .setDescription("Le serveur est actuellement \`❌ Offline\` !")
                    .setTimestamp()

                message.edit({embeds: [e1]})

                }
            }
        },(config.actuStatusMSG * 1000))



////FIN MESSAGE STATUT////
});
