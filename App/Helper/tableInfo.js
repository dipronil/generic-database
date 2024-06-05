exports.getFindAll = async (tableName, attribute,where) => {
    let query;

    if (Array.isArray(attribute) && attribute.length > 0) {
        const attributeList = attribute.join(", ");
        query =  `SELECT ${attributeList} FROM ${tableName}`
    } else {
        query = `SELECT * FROM ${tableName}`
    }
    if(where){
        const whereClauses = Object.keys(where).map((key) => {
            const value = where[key];
            const formattedValue = typeof value === 'string' ? `'${value}'` : value;
            return `${key} = ${formattedValue}`;
        });
        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    return query;
}

exports.getFindById = async (tableName, attribute, id) => {
    if (Array.isArray(attribute) && attribute.length > 0) {
        const attributeList = attribute.join(", ");
        return `SELECT ${attributeList} FROM ${tableName} WHERE id=${id}`
    } else {
        return `SELECT * FROM ${tableName} WHERE id=${id}`
    }
}

exports.getFindOne = async (tableName, attribute, where) => {
    let query;

    const whereClauses = Object.keys(where).map((key) => {
        const value = where[key];
        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        return `${key} = ${formattedValue}`;
    });

    if (Array.isArray(attribute) && attribute.length > 0) {
        const attributeList = attribute.join(", ");
        query = `SELECT ${attributeList} FROM ${tableName}`
    } else {
        query = `SELECT * FROM ${tableName}`
    }

    query += ` WHERE ${whereClauses.join(' AND ')}`;
    return query;
}