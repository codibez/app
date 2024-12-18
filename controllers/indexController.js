const mysql = require('mysql');

// RENDER FEEDBACK TO VALIDATE/ PAGE 
// response.render('index', { msg: msg })

// @desc    show form
// @route   GET validate/
const validate = (request, response, next) => {
    console.log(`request method: ${request.method}`);

    if (request.method == 'POST') {
        const code = request.body.code;
        console.log(`user input: ${code}`);

        const con = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        con.connect((error) => {
            if (error) throw error;
            console.log('Connected');
        });

        // stored code: 95ff3djb

        const sql = `SELECT * FROM members WHERE code = '${code}'`;
        con.query(sql, (error, result, fields) => {
            if (error) throw error;
            if (result.length > 0) {
                // ensure datetime does not exceed 15minutes
                // send success message, update discord role(s)
                console.log(`user ${result[0].name}[${result[0].clientId}] found, update roles...`);
            } else {
                // no result, send error message
                console.log(`that code does not exist, please try again...`);
            }
        });

        return;
    }

    response.render('index');
}

module.exports = validate;