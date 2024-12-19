const { Client } = require('discord.js');
const mysql = require('mysql');

// @desc    show form
// @route   GET validate/
async function validate(request, response, next) {
    // establish return msg
    let feedback = '';

    if (request.method === 'POST') {
        // stored code: 68dfcg1b

        // get input 
        const code = request.body.code;

        // establish database connection
        const con = fns.dbConnect();

        // gather data where code matches 
        const sql = `SELECT * FROM ${process.env.TABLE} WHERE code = '${code}'`;
   
        // create promise
        const validation = new Promise(resolve => {
            // query database
            con.query(sql, (error, result, fields) => {
                // throw any existing error:
                if (error) throw error;

                // log result:
                console.log(result);

                // if data exists,
                if (result.length > 0) {
                    // establish time object
                    const time = {
                        stored: result[0].generated,
                        now: new Date(),
                        difference: (new Date() - result[0].generated)
                    };

                    // if difference > 10 minutes
                    if (time.difference > 600000) {
                        feedback = 'code expired.';
                    } else {
                        feedback = 'validation success!';
                        
                        // update role
                    }
                } else {
                    feedback = 'invalid code.';
                }

                resolve(feedback);
            });
        });

        // render feedback to validation page:
        response.render('index', {feedback: await validation});
    }

    // render validation page:
    if (request.method === 'GET') {
        response.render('index', {feedback: feedback});
    };
};

// functions
const fns = {
    dbConnect: function(){
        const con = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        con.connect(error => {
            if (error) throw error;
            console.log('Connected!');
        });

        return con;
    },
};

module.exports = validate;