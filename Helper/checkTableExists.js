const { pool } = require("../DbConfig");

exports.checkTableExists = async (tableName) => {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    const res = await pool.query(query, [tableName]);
    return res.rows[0].exists;
  };

  exports.checkColumnExists = async (tableName, columnName) => {
    const query = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1 AND column_name = $2;
    `;
    const res = await pool.query(query, [tableName, columnName]);
    return res.rows.length > 0;
  };


  exports.modifyScheme = async (schema)=>{
    if (!('id' in schema)) {
      schema.id = {
        type: 'integer',
        primaryKey: true,
        unique: true,
        nullable: false
      };
    }

    return schema
  }
