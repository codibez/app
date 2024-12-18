// import required modules
const errorHandler = require('./middleware/error.js');
const express = require('express');
const fs = require('node:fs');
const index = require('./routes/index.js');
const logger = require('./middleware/logger.js');
const notFound = require('./middleware/notFound.js');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, MessageFlags, GuildMember } = require('discord.js');
const port = process.env.PORT || 8000;
const token = process.env.TOKEN;

// initialize app/discord
const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

// set view engine
app.set('view engine', 'ejs');
app.set('views', 'public/views');

// body parser (middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);

// Error handler
app.use(notFound);
app.use(errorHandler);

// (setup) discord bot
client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'bot', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'bot', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
app.listen(port, () => console.log(`Server Started @ http://localhost:${port}`));