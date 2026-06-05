const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

dbPool.getConnection((err, connection) => {
    if (err) {
        console.error('Database Connection Failed:', err);
        return;
    }

    console.log('Database Connected Successfully');
    connection.release();
});

module.exports = dbPool.promise();