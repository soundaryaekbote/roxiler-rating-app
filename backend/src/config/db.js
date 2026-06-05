const mysql = require('mysql2');

const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

connectionPool.getConnection((err, connection) => {
    if (err) {
        console.log('Database Connection Error:', err);
        return;
    }

    console.log('Database Connected Successfully');
    connection.release();
});

module.exports = connectionPool.promise();