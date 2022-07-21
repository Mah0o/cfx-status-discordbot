const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config")
const cfx = require("cfx-api");


module.exports = {
    name: "status",
    description: "Permet d'avoir le status du server.",
    type: ApplicationCommandType.ChatInput,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const e0 = new EmbedBuilder().setColor("#8B0000").setDescription("Erreur | Vous n'avez pas les permissions requises.")
        const e1 = new EmbedBuilder().setColor("#8B0000").setDescription("Erreur | Veuillez vérifier le fichier \`config\`.")
        if (!interaction.member.roles.cache.has(config.staffRole)) return interaction.followUp({ embeds: [e0] })   //verif membre role
        if(!config.serverID || !config.serverIP || !config.staffRole ) return interaction.followUp({ embeds: [e1] })   //verif config.js

        const server = await cfx.fetchServer(config.serverID)

        let pOnline = ""
        const listPlayer = server.players
        if(Object.keys(listPlayer).length === 0 == true) {pOnline = "Aucun Joueur Connecté"} else {for(let p of listPlayer) {pOnline += `➔ \`${p.name}\`\n`}}

        const e2 = new EmbedBuilder()
        .setTitle(`${server.projectName}`)
        .setColor("#228B22")
        .setDescription(
            `**IP Serveur** : \`💻 ${config.serverIP}\`\n` +
            `**Etat Serveur** : \`✅ Online\`\n` +
            `**Joueur Connecté** : \`${server.playersCount}\` / \`${server.maxPlayers}\`` +
            `\n\n` +
            `**Liste des Joueurs** :\n ${pOnline}`
        )
        .setFooter({ text: `Envoyé par ${interaction.user.tag}` })
        .setTimestamp()

        interaction.followUp({ embeds: [e2] })  
    },
};
