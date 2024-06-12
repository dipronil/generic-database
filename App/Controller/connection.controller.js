const {
  establishConnection,
  establishConnectionWithUrl,
} = require("../../Config/establishConnection");
const mapType = require("../Helper/dataType");
exports.connection = async (req, res, next) => {
  try {
    let getConectionStatus;
<<<<<<< HEAD
    if(typeof req.body.configration === "string"){
        const url = req?.body?.configration
        getConectionStatus = await establishConnectionWithUrl(url)
        console.log(getConectionStatus);
        return res.status(200).json({
          message: getConectionStatus.message
      })
=======
    if (typeof req.body.configration === "string") {
      const url = req?.body?.configration;
      getConectionStatus = await establishConnectionWithUrl(url);
>>>>>>> 7ed290ef65e1c20a83aad9b02e6e4d20fc270684
    } else {
      const { dialect, user, host, database, password, port } =
        req?.body?.configration;
      const connectionPayload = {
        dialect,
        user,
        host,
        database,
        password,
        port,
      };

      getConectionStatus = await establishConnection(connectionPayload);
      return res.status(200).json({
        message: getConectionStatus.message,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createModel = async (req, res, next) => {
  try {
    const schema = req?.body?.schema;
    const tableName = req?.body?.tableName;
    const modelSchemaNoSQL = await convertToMongoSchema(schema);
    // const modelSchemaSQL = await convertToPostgresQuery(schema, tableName);

    
    return res.status(200).json({ noSqlSchema: modelSchemaNoSQL, SqlSchema:schema});
  } catch (error) {
    next(error);
  }
};

convertToMongoSchema = (inputSchema) => {
  const mongoSchema = {
    _id: {
      type: "Schema.Types.ObjectId", // Use ObjectId for MongoDB
      auto: true,
    },
  };

  for (const key in inputSchema) {
    if (key === "id") continue; // Skip the id field since it is mapped to _id

    const field = inputSchema[key];
    const mongoField = {
      type: "",
    };

    switch (field.type) {
      case "integer":
        mongoField.type = "Number";
        break;
      case "string":
        mongoField.type = "String";
        break;
      case "boolean":
        mongoField.type = "Boolean";
        break;
      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    if (field.foreignKey) {
      mongoField.ref =
        field.reference.tableName.charAt(0).toUpperCase() +
        field.reference.tableName.slice(1);
      mongoField.required = true;
    }

    mongoSchema[key] = mongoField;
  }

  return mongoSchema;
};

convertToPostgresQuery = (schema, tableName) => {
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
  return createTableQuery;
};
