const pg = require('pg');

const connection = new pg.Client({
    user: 'ykflbsnrqqyhgs',
    password: process.env.DB_PASSWORD,
    database: 'd22lnt48uqb9st',
    port: 5432,
    host: 'ec2-54-227-241-179.compute-1.amazonaws.com',
    ssl: true
});



connection.connect((err) =>{
    if (err) {
        console.log(err);
    } else {
        console.log('woohoo connected');
    }
});


module.exports = connection;

