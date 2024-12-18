const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE
});

const getRandomStr = (length) => {
	return Math.random().toString(20).substr(2, length);
}

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('code')
		.setDescription('Provides a new validation code to guests.'),
	async execute(interaction) {
		let msg;
		
		// connect to database
		con.connect(error => {
			// if error exists, log it
			if (error) throw error;

			// generate new code
			const code = getRandomStr(8);

			// log who generated new code/new code
			console.log(`[${interaction.user.id}] generated a new code: ${code}`);
			
			// prepare sql/query
			sql = `SELECT code from ${process.env.TABLE} WHERE clientId = ${interaction.user.id}`;
			con.query(sql, (error, result, fields) => {
				// if error exists, log it
				if (error) throw error;

				// if result exists,
				if (result.length > 0) {
					// set msg
					console.log(`user found!\nstored code: ${result[0].code}\nnew code: ${code}`);

					// stored datetime format: (SQL)
					// 2024-12-15 14:21:11

					// generate new datetime
					const now = new Date();
					const date = {
						year: now.getFullYear(),
						month: now.getMonth()+1,
						day: now.getDate(),
						hour: now.getHours(),
						minute: now.getMinutes(),
						seconds: now.getSeconds(),
					};
					const datetime = {
						sql: `${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.seconds}`,
						US: `${date.month}/${date.day}/${date.year} ${date.hour}:${date.minute}:${date.seconds}`
					};
					
					// log new datetime (US-format)
					console.log(`new code generated at: ${datetime.US}`);

					// prepare sql/query
					const sql = `UPDATE members SET code = '${code}', generated='${datetime.sql}' WHERE clientId = ${interaction.user.id}`;
					con.query(sql, (error, result, fields) => {
						// if error exists, log it
						if (error) throw error;
						// set msg
						msg = `<@${interaction.user.id}> You've updated your validation code to **${code}** at ${datetime.US}.\nVerify your account at https://heartfx.org/validate before it expires in 15 minutes!`;
						interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
						// interaction.user.send(msg);
					});
				} else {
					// if result does not exist, add user to database
					// add to database:
					msg = `<@${interaction.user.id}> was not found in database, use */register* to be added.`;
					interaction.reply({ content: msg, flags:MessageFlags.Ephemeral });
					// interaction.user.send(msg);
				}
			});
		});

		// await interaction.reply({ content: 'Secret Pong!', flags: MessageFlags.Ephemeral });
	},
};