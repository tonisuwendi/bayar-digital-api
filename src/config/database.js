const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 30,
    queueLimit: 0,
});

const createInvoiceTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS invoice (
                id VARCHAR(12) PRIMARY KEY,
                invoice_code VARCHAR(12),
                title VARCHAR(100),
                price INT,
                evidence VARCHAR(100),
                thumbnail VARCHAR(100),
                ipaymu_notify_url VARCHAR(100),
                transaction_id VARCHAR(20),
                qr_string TEXT
            )
        `);
    } catch (error) {
        console.log(error);
    }
};

const createTables = () => {
    createInvoiceTable();
};

createTables();

module.exports = pool;
