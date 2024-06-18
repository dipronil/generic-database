// const { pool } = require("../../Config");
const { getColumnNames, getForeignKeyData } = require("./checkTableExists");

exports.getFindAll = async (tableName, attribute, where, include) => {
  let query, whereQuery;

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
    let columns, postColumns;
    let includeTableName = include[0]?.tableName.toLowerCase();

    if (Array.isArray(attribute) && attribute.length > 0) {
      columns = await getColumnNames(tableName, attribute);
    }else{
      columns = await getColumnNames(tableName);
    }

    if (Array.isArray(include[0]?.attribute) && include[0]?.attribute.length > 0) {
      postColumns = await getColumnNames(includeTableName, include[0]?.attribute);
    }else{
      postColumns = await getColumnNames(includeTableName);
    }
    const selectClause = columns.map((col) => `${tableName}.${col}`).join(", ");
    const objectPairs = postColumns.map((col) => `'${col}', posts.${col}`);
    const objectPairsString = objectPairs.join(", ");
    const foreingnData = await getForeignKeyData(includeTableName);
    if (where) {
      const whereClauses = Object.keys(where).map((key) => {
        const value = where[key];
        const formattedValue = typeof value === "string" ? `'${value}'` : value;
        return `${tableName}.${key} = ${formattedValue}`;
      });
      whereQuery = ` WHERE ${whereClauses.join(" AND ")}`;
    }
    query = `SELECT ${selectClause},
        json_agg(json_build_object(${objectPairsString})) AS ${includeTableName}
        FROM ${tableName}
        INNER JOIN posts ON ${foreingnData?.referenced_table}.${foreingnData?.referenced_column} = ${includeTableName}.${foreingnData?.fk_column}
        ${whereQuery ? whereQuery : ''}
        GROUP BY ${selectClause}
    `;

    
  }
  console.log(query);
  return query;
};

// const getColumnNames = async (tableName, attribute) => {
//   const client = await pool.connect();
//   try {
//     let queryCol;
//     if (attribute) {
//       const columnsString = attribute.map(col => `'${col}'`).join(", ");
//       queryCol = `
//       SELECT column_name 
//       FROM information_schema.columns 
//       WHERE table_name = '${tableName}' 
//         AND column_name IN (${columnsString})
//     `;
//     }else{
//       queryCol =  `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`;
//     }
//     const result = await client.query(
//      queryCol
//     );
//     return result.rows.map((row) => row.column_name);
//   } finally {
//     client.release();
//   }
// };

// const getForeignKeyData = async (tableName) => {
//   const client = await pool.connect();
//   try {
//     const result = await client.query(
//       `SELECT
//           kcu.constraint_name AS foreign_key_name,
//           kcu.column_name AS fk_column,
//           ccu.table_name AS referenced_table,
//           ccu.column_name AS referenced_column
//       FROM
//           information_schema.table_constraints tc
//           JOIN information_schema.key_column_usage kcu
//             ON tc.constraint_name = kcu.constraint_name
//             AND tc.table_schema = kcu.table_schema
//           JOIN information_schema.constraint_column_usage ccu
//             ON ccu.constraint_name = tc.constraint_name
//       WHERE
//           tc.constraint_type = 'FOREIGN KEY'
//           AND kcu.table_name = '${tableName}'
//           AND kcu.table_schema = 'public'`
//     );
//     return result.rows[0];
//   } finally {
//     client.release();
//   }
// };

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
