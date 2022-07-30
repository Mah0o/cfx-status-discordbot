const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config.json")
const cfx = require("cfx-api");
const { PermissionsBitField } = require('discord.js');


module.exports = {
    name: "status",
    description: "Permet d'avoir le status du server.",
    type: ApplicationCommandType.ChatInput,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {

        const e0 = new EmbedBuilder().setColor("#8B0000").setDescription("Erreur | Veuillez vérifier le fichier \`config\`.")
        const e1 = new EmbedBuilder().setColor("#8B0000").setDescription("Erreur | Vous n'avez pas les permissions requises.")
        if(!config.serverID || !config.serverIP || !config.staffRole ) return interaction.followUp({ embeds: [e0] })   //verif config.json
        if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(config.staffRole)) {

            const server = await cfx.fetchServer(config.serverID)

            let pOnline = ""
            const listPlayer = server.players
            if(listPlayer.length === 0) {pOnline = "Aucun Joueur Connecté"} else {listPlayer.map(e => {pOnline += `➔ \`${e.name}\`\n`})}

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

        }else return interaction.followUp({ embeds: [e1] })

    },
};
