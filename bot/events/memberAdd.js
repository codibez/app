const { Events } = require('discord.js');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        console.log(`${member.displayName}[${member.id}] has joined the server.`);
        
        if (member.id) {
            const channel = member.client.channels.cache.find(channel => channel.name === 'welcome');
            const messages = [
                `Welcome to the :poop: show, <@${member.id}>.`,
                `Look who has finally joined the party, <@${member.id}>.`,
                `I think I am going to be sick, <@${member.id}> has joined.`,
                `Ready, Set, <@${member.id}>!`,
            ];
            const random = Math.floor(Math.random()*messages.length);
            const message = messages[random];
            channel.send(message);

            const getRandomStr = function(length=8) {
                return Math.random().toString(20).substr(2, length);
            }

            const code = getRandomStr();

            // Connect to database:
            con.connect((error) => {
                if (error) throw error;
                console.log('Database Connected!');
                // CREATE TABLE IF NOT EXISTS:
                const sql = `CREATE TABLE IF NOT EXISTS ${process.env.TABLE} (id INT AUTO_INCREMENT PRIMARY KEY, clientId VARCHAR(255), name VARCHAR(255), code VARCHAR(255))`;
                con.query(sql, (error, result) => {
                    if (error) throw error;
                    console.log('Table created!');
                    // INSERT TO DATABASE:
                    const sql = `INSERT INTO ${process.env.TABLE} (clientId, name, code) VALUES ('${member.id}', '${member.displayName}', '${code}')`;
                    con.query(sql, (error, result) => {
                        if (error) throw error;
                        console.log('1 record inserted.');
                    });
                });
            });

            console.log(`random string: ${code}`);
            member.send(`**<@${member.id}>**, welcome to the **HeartFX.org Discord**!\nTo view more channels please complete verification at https://heartfx.org/verify\nYour code is \`**${code}**\` and will expire in 15 minutes!`);
        }
    },
};

/*
// Fetch a channel by its id (1287230891394863145)
const channel = member.channels.cache.find(channel => channel.name === 'welcome');
const messages = [
    `Welcome to the shitshow ${member.displayName}.`,
    `Oh great... ${member.displayName} has joined.`
];
*/