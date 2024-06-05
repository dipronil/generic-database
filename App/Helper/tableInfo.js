const { pool } = require("../../Config");

exports.getFindAll = async (tableName, attribute, where, include) => {
  let query;

  if (Array.isArray(attribute) && attribute.length > 0) {
    const attributeList = attribute.join(", ");
    query = `SELECT ${tableName}.${attributeList} FROM ${tableName}`;
  } else {
    query = `SELECT * FROM ${tableName}`;
  }
  if (where) {
    const whereClauses = Object.keys(where).map((key) => {
      const value = where[key];
      const formattedValue = typeof value === "string" ? `'${value}'` : value;
      return `${key} = ${formattedValue}`;
    });
    query += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  if (include) {
    let includeTableName = include[0]?.tableName.toLowerCase();
    const columns = await getColumnNames(tableName);
    const postColumns = await getColumnNames(includeTableName);
    const objectPairs = postColumns.map(col => `'${col}', posts.${col}`);
    const objectPairsString = objectPairs.join(', ');
  
    const selectClause = columns.map(col => `${tableName}.${col}`).join(', ');

    query = `SELECT ${selectClause},
        json_agg(json_build_object(${objectPairsString})) AS posts
        FROM ${tableName}
        INNER JOIN posts ON ${tableName}.id = posts.userId
        GROUP BY ${selectClause}
    `;
  }

  return query;
};

const getColumnNames = async (tableName) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`
    );
    return result.rows.map((row) => row.column_name);
  } finally {
    client.release();
  }
};

exports.getFindById = async (tableName, attribute, id) => {
  if (Array.isArray(attribute) && attribute.length > 0) {
    const attributeList = attribute.join(", ");
    return `SELECT ${attributeList} FROM ${tableName} WHERE id=${id}`;
  } else {
    return `SELECT * FROM ${tableName} WHERE id=${id}`;
  }
};

exports.getFindOne = async (tableName, attribute, where) => {
  let query;

  const whereClauses = Object.keys(where).map((key) => {
    const value = where[key];
    const formattedValue = typeof value === "string" ? `'${value}'` : value;
    return `${key} = ${formattedValue}`;
  });

  if (Array.isArray(attribute) && attribute.length > 0) {
    const attributeList = attribute.join(", ");
    query = `SELECT ${attributeList} FROM ${tableName}`;
  } else {
    query = `SELECT * FROM ${tableName}`;
  }

  query += ` WHERE ${whereClauses.join(" AND ")}`;
  return query;
};
