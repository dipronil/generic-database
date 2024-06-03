const express = require('express')
const app = express();
const { queryDatabase, pool } = require('./DbConfig');
const bodyParser = require('body-parser');
const mapType = require("./Helper/dataType")
const {checkTableExists, checkColumnExists, modifyScheme} = require("./Helper/checkTableExists")

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
port = 3000

queryDatabase();

/***** create table */
app.post('/api/v1/createTable', async (req, res) => {
    try {
        const tableName = req?.body?.tableName.toLowerCase();
        let schema = req?.body?.schema;
        schema = await modifyScheme(schema);
        
        let isTableExists = await checkTableExists(tableName);
        if (isTableExists) {
            return res.json({ message: 'Table already exists' })
        } else {
            let createTableQuery = `CREATE TABLE ${tableName} (\n`;
            for (const key in schema) {
                if (schema.hasOwnProperty(key)) {

                    if (key === 'id' && schema[key].type == 'integer') {
                        createTableQuery += `    ${key} SERIAL`;
                    }else{
                        const type = mapType(schema[key].type);
                        createTableQuery += `    ${key} ${type}`;
                    }
                    
                    if(schema[key].primaryKey){
                        createTableQuery += ` PRIMARY KEY`;
                    }
                    if(schema[key].unique){
                        createTableQuery += ` UNIQUE`;
                    }
                    if(schema[key].nullable){
                        createTableQuery += ` NOT NULL`;
                    }
                    if(schema[key].defaultValue){
                        createTableQuery += ` DEFAULT '${schema[key].defaultValue}'`;
                    }
                    if (schema[key].foreignKey) {
                        createTableQuery += ` REFERENCES ${schema[key].reference.tableName}(${schema[key].reference.columnName})`;
                    }
                }
                createTableQuery += ',\n';
            }
            createTableQuery = createTableQuery.slice(0, -2) + "\n);";
            console.log(createTableQuery);
            pool.query(createTableQuery);
            return res.json({ message: 'table created' })
        }
    } catch (error) {
        console.log(error);
    }
})

/***** update table */
app.post('/api/v1/updateTable', async (req, res) => {
    try {
        const tableName = req?.body?.tableName.toLowerCase();
        const schema = req?.body?.schema;
        let isTableExists = await checkTableExists(tableName);
        if (isTableExists) {
            let updateTableQuery = `ALTER TABLE ${tableName} ADD \n`;
            
            for (const key in schema) {
                const isColumnExists = await checkColumnExists(tableName,schema[key]);
                if(!isColumnExists){
                    return res.json({ message: `This field already exists.` }) 
                }
                if (schema.hasOwnProperty(key)) {
                    const type = mapType(schema[key].type);
                    updateTableQuery += `${key} ${type}`
                }
            }
            pool.query(updateTableQuery);
            return res.json({ message: 'Table updated' }) 
        } else{
            return res.json({ message: 'Table not exists' })
        }
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})