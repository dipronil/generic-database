const express = require("express");
const app = express();
const { queryDatabase, pool } = require("./DbConfig");
const bodyParser = require("body-parser");
const mapType = require("./Helper/dataType");
const {
  checkTableExists,
  checkColumnExists,
  modifyScheme,
} = require("./Helper/checkTableExists");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
port = 3000;

queryDatabase();

/***** create table */
app.post("/api/v1/createTable", async (req, res) => {
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
    console.log(error);
  }
});

/***** update table */
app.post("/api/v1/updateTable", async (req, res) => {
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
    console.log(error);
  }
});

/*** get gata */
app.post("/api/v1/getData", async (req, res) => {
  try {
    const tableName = req?.body?.tableName?.toLowerCase();
    const schema = req?.body?.schema;

    if (!tableName || !schema) {
      return res.status(400).json({
        message: "Invalid request. Please provide tableName and schema.",
      });
    }

    let query = "";
    if (schema.hasOwnProperty("attribute")) {
      const attributes = schema["attribute"];
      
      if (Array.isArray(attributes) && attributes.length > 0) {
        const attributeList = attributes.join(", ");
        query = `SELECT ${attributeList} FROM ${tableName}`;
      } else {
        return res.status(400).json({ message: "Invalid schema attributes." });
      }
    }

    // if (schema.hasOwnProperty("where")) {
    //   const whereCond = schema["where"];

    //   const whereClauses = Object.keys(whereCond).map((key) => {
    //     return `${key} = ${whereCond[key]}`;
    //   });
    //   query = `SELECT * FROM ${tableName} WHERE ${whereClauses.join(" AND ")}`;
    // } else {
    //   query = `SELECT * FROM ${tableName}`;
    // }
    
    if (schema.hasOwnProperty("where")) {
        const whereCond = schema["where"];
  
        const whereClauses = Object.keys(whereCond).map((key) => {
          return `${key} = ${whereCond[key]}`;
        });
        query += ` WHERE ${whereClauses.join(" AND ")}`;
      } 

      console.log(query);

    const isTableExists = await checkTableExists(tableName);
    if (isTableExists) {
      const result = await pool.query(query);
      res.json(result.rows);
    } else {
      return res.status(404).json({ message: "Table not exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
