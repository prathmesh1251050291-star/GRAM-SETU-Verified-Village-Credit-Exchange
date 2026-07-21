const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const isTest = process.env.NODE_ENV === "test";

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Render and other cloud DBs
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: isTest
            ? "violet_test"
            : process.env.DB_NAME
    });

// IMPORTANT: allow graceful shutdown in tests
module.exports = pool;
