const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const config = require("./config.json")
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.db = require("./config.json");


// Initializing the project
require("./handler")(client);

client.login(config.token);