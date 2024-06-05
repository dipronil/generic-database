const mapType = require("../Helper/dataType");
const { pool } = require("../../Config/");
const {
  checkTableExists,
  checkColumnExists,
  modifyScheme,
} = require("../Helper/checkTableExists");
const { getFindAll, getFindById, getFindOne } = require("../Helper/tableInfo");

exports.createTable = async (req, res, next) => {
  try {
    const tableName = req?.body?.tableName.toLowerCase();
    let schema = req?.body?.schema;
    schema = await modifyScheme(schema);

    let isTableExists = await checkTableExists(tableName);
    if (isTableExists) {
      return res.json({ message: "Table already exists" });
    } else {
      let createTableQuery = `CREATE TABLE ${tableName} (\n`;
      for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
          if (key === "id" && schema[key].type == "integer") {
            createTableQuery += `    ${key} SERIAL`;
          } else {
            const type = mapType(schema[key].type);
            createTableQuery += `    ${key} ${type}`;
          }

          if (schema[key].primaryKey) {
            createTableQuery += ` PRIMARY KEY`;
          }
          if (schema[key].unique) {
            createTableQuery += ` UNIQUE`;
          }
          if (schema[key].nullable) {
            createTableQuery += ` NOT NULL`;
          }
          if (schema[key].defaultValue) {
            createTableQuery += ` DEFAULT '${schema[key].defaultValue}'`;
          }
          if (schema[key].foreignKey) {
            createTableQuery += ` REFERENCES ${schema[key].reference.tableName}(${schema[key].reference.columnName})`;
          }
        }
        createTableQuery += ",\n";
      }
      createTableQuery = createTableQuery.slice(0, -2) + "\n);";
      console.log(createTableQuery);
      pool.query(createTableQuery);
      return res.json({ message: "table created" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    const tableName = req?.body?.tableName.toLowerCase();
    const schema = req?.body?.schema;
    let isTableExists = await checkTableExists(tableName);
    if (isTableExists) {
      let updateTableQuery = `ALTER TABLE ${tableName} ADD \n`;

      for (const key in schema) {
        const isColumnExists = await checkColumnExists(tableName, schema[key]);
        if (!isColumnExists) {
          return res.json({ message: `This field already exists.` });
        }
        if (schema.hasOwnProperty(key)) {
          const type = mapType(schema[key].type);
          updateTableQuery += `${key} ${type}`;
        }
      }
      pool.query(updateTableQuery);
      return res.json({ message: "Table updated" });
    } else {
      return res.json({ message: "Table not exists" });
    }
  } catch (error) {
    next(error);
  }
};


exports.getTableData = async (req, res, next) => {
  try {
    const tableName = req?.body?.tableName?.toLowerCase();
    const operation = req?.body?.operation;
    const id = req?.body?.id;
    const attribute = req?.body?.attribute;
    const where = req?.body?.where;
    const excludeAttribute = req?.body?.excludeAttribute;
    const include = req?.body?.include;

    if (!tableName || !operation) {
      return res.status(400).json({
        message: "Invalid request. Please provide tableName and schema.",
      });
    }

    const isTableExists = await checkTableExists(tableName);
    if (!isTableExists) {
      return res.status(404).json({ message: "Table not exists" });
    }

    let query = "";
    switch (operation) {
      case "findAll":
        query = await getFindAll(tableName, attribute, where, include);
        break;
      case "findById":
        query = await getFindById(tableName, attribute, id);
        break;
      case "findOne":
        query = await getFindOne(tableName, attribute, where);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
    console.log(query);
    const result = await pool.query(query);
    if (operation == 'findOne') {
        return res.json(result.rows[0]);
    }else{
        return res.json(result.rows);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
