const { pool } = require("../../Configration/establishConnection");

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

exports.modifyScheme = async (schema) => {
  if (!("id" in schema)) {
    schema.id = {
      type: "integer",
      primaryKey: true,
      unique: true,
      nullable: false,
    };
  }

  return schema;
};


exports.getColumnNames = async (tableName, attribute) => {
  const client = await pool.connect();
  try {
    let queryCol;
    if (attribute) {
      const columnsString = attribute.map(col => `'${col}'`).join(", ");
      queryCol = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}' 
        AND column_name IN (${columnsString})
    `;
    }else{
      queryCol =  `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`;
    }
    const result = await client.query(
     queryCol
    );
    return result.rows.map((row) => row.column_name);
  } finally {
    client.release();
  }
};

exports.getForeignKeyData = async (tableName) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT
          kcu.constraint_name AS foreign_key_name,
          kcu.column_name AS fk_column,
          ccu.table_name AS referenced_table,
          ccu.column_name AS referenced_column
      FROM
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
      WHERE
          tc.constraint_type = 'FOREIGN KEY'
          AND kcu.table_name = '${tableName}'
          AND kcu.table_schema = 'public'`
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};