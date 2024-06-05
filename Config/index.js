const { Pool } = require('pg');

// Create a new pool instance with your database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'supabase-clone',
  password: '12345678',
  port: 5432,
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