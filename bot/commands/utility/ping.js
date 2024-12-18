const { SlashCommandBuilder, MessageFlags, flatten, Message } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({ content: 'Secret Pong!', flags: MessageFlags.Ephemeral });
		await wait(2_000);
		await interaction.editReply({ content: 'Secret Pong again!', flags: MessageFlags.Ephemeral });
	},
};