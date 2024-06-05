const mapType = (schemaType) =>{
    switch (schemaType) {
        case "string":
            return "VARCHAR(255)";
        case "integer":
            return "INTEGER";
        case "boolean":
            return "BOOLEAN";
        default:
            throw new Error(`Unsupported type: ${schemaType}`);
    }
}

module.exports = mapType;