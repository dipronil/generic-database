const {
  establishConnection,
  establishConnectionWithUrl,
} = require("../../Configration/establishConnection");
const mapType = require("../Helper/dataType");
const SchemaInfo = require("../../mongoModel/SchemaInfo")


exports.connection = async (req, res, next) => {
  try {
    const projectId = req?.header('projectId');
    const organizationId = req?.header('organizationId');
    let getConectionStatus;
    if(typeof req.body.configration === "string"){
        const url = req?.body?.configration
        getConectionStatus = await establishConnectionWithUrl(url,projectId,organizationId)
        return res.status(200).json({
          message: getConectionStatus.message,
          connectionId:getConectionStatus.connectionId
      })
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
    const projectId = req?.header('projectId');
    const organizationId = req?.header('organizationId');
    const schema = req?.body?.schema;
    const tableName = req?.body?.tableName;
    const modelSchemaNoSQL = await convertToMongoSchema(schema);
    // const modelSchemaSQL = await convertToPostgresQuery(schema, tableName);

    const schemaInfo = new SchemaInfo({
      projectId: projectId,
      organizationId:organizationId,
      body: modelSchemaNoSQL
    })
    await schemaInfo.save();
    return res.status(200).json({ noSqlSchema: modelSchemaNoSQL, SqlSchema:schema});
  } catch (error) {
    next(error);
  }
};

convertToMongoSchema = (inputSchema) => {
  const mongoSchema = {};

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
