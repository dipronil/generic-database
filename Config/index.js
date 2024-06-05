const { Pool } = require('pg');

console.log( process.env.DB_USER);
// Create a new pool instance with your database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port:process.env.DB_PORT
});


const queryDatabase = async () => {
    const client = await pool.connect();
    try { 
      console.log("DB connect");
    } catch (err) {
      console.error('Error executing query', err.stack);
    }
    finally {
        client.release();
      }
  };

module.exports = {queryDatabase,pool};