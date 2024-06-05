const { Pool } = require('pg');

// Create a new pool instance with your database configuration
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port:process.env.PORT
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