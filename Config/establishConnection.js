const { Pool } = require("pg");
const { mongoose } = require("mongoose");

exports.establishConnectionWithUrl = async (connectionString) => {
  console.log(connectionString);
}

exports.establishConnection = async (connectionData) => {
  let pool, queryDatabase;
  switch (connectionData?.dialect) {
    case "postgres":
      pool = new Pool({
        user: connectionData?.user,
        host: connectionData?.host,
        database: connectionData?.database,
        password: connectionData?.password,
        port: connectionData?.port,
        // dialect:connectionData?.dialect
      });
      client = await pool.connect();
      try {
        return {message: "Connected to postgres", pool: pool}
      } catch (err) {
        return {message: "Non-connected to postgres",}
      } finally {
        client.release();
      }
      break;
    case "mongodb":
      // const mongoURI = `mongodb://${connectionData?.user}:${connectionData?.password}@${connectionData?.host}:${connectionData?.port}`;
      const mongoURI = connectionData?.url;
      console.log(mongoURI);
      try {
        const mongoConnection = await mongoose.connect(mongoURI);
        console.log(mongoConnection);
      } catch (error) {
        throw error;
      }
      console.log("Connected to MongoDB");
      break;
    default:
      throw new Error("Invalid dialect");
  }
};



// module.exports = { queryDatabase, pool };
